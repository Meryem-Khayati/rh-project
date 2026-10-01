// services/cv.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
export interface DeleteCVResponse {
  success: boolean;
  message: string;
}

export interface HasCVResponse {
  hasCV: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CvService {
  private CV_API = 'http://localhost:8088/cv-service/api/cv/upload'; 
  private CV_API_BASE = 'http://localhost:8088/cv-service/api/cv'; 

  constructor(private http: HttpClient) {}

  uploadCV(file: File, candidatId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidatId', candidatId.toString());

    return this.http.post(this.CV_API, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Télécharge le CV d'un candidat comme BLOB (recommandé)
   */
  downloadCV(candidatId: number): Observable<Blob> {
    return this.http.get(`${this.CV_API_BASE}/candidat/${candidatId}/download`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Ouvre le CV dans un nouvel onglet (utilise l'endpoint /download)
   */
  openCVInNewTab(candidatId: number): void {
    const url = `${this.CV_API_BASE}/candidat/${candidatId}/download`;
    window.open(url, '_blank');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Erreur lors de la récupération du CV.';
    if (error.status === 404) {
      errorMsg = 'Aucun CV trouvé pour ce candidat.';
    } else if (error.error instanceof ErrorEvent) {
      errorMsg = `Erreur client : ${error.error.message}`;
    } else {
      errorMsg = `Erreur serveur : ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }

  // NOUVELLE MÉTHODE : Vérifier si un candidat a un CV
  hasCV(candidatId: number): Observable<boolean> {
    return this.http.get<HasCVResponse>(`${this.CV_API_BASE}/candidat/${candidatId}/has-cv`).pipe(
      map(response => response.hasCV),
      catchError((error: HttpErrorResponse) => {
        // Si l'endpoint n'existe pas ou erreur, retourner false
        if (error.status === 404 || error.status === 500) {
          return of(false);
        }
        return throwError(() => new Error('Erreur lors de la vérification du CV'));
      })
    );
  }

  // NOUVELLE MÉTHODE : Supprimer un CV par ID de candidat
  deleteCV(candidatId: number): Observable<DeleteCVResponse> {
    return this.http.delete<DeleteCVResponse>(`${this.CV_API_BASE}/candidat/${candidatId}`).pipe(
      catchError(this.handleError)
    );
  }

  // NOUVELLE MÉTHODE : Supprimer un CV par son ID
  deleteCVById(cvId: number): Observable<DeleteCVResponse> {
    return this.http.delete<DeleteCVResponse>(`${this.CV_API_BASE}/${cvId}`).pipe(
      catchError(this.handleError)
    );
  }

  // NOUVELLE MÉTHODE : Récupérer les informations du CV
  getCVInfo(candidatId: number): Observable<any> {
    return this.http.get(`${this.CV_API_BASE}/candidat/${candidatId}`).pipe(
      catchError(this.handleError)
    );
  }


  
}