import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Recruteur } from '../../models/Recruteur';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class RecruteurService {
  private BASE_URL = "http://localhost:8088/authentication-service/users";

  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer

  ) { }

  getAllRecruteurs(): Observable<Recruteur[]> {
    return this.http.get<Recruteur[]>(this.BASE_URL + '/recruteurs');
  }

  addRecruteur(recruteur: Partial<Recruteur>): Observable<Recruteur> {
    return this.http.post<Recruteur>(`${this.BASE_URL}/register/recruteur`, recruteur).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message || error.message || 'Erreur lors de l\'inscription';
        return throwError(() => new Error(msg));
      })
    );
  }

  uploadLogo(recruteurId: number, logo: File): Observable<string> {
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('recruteurId', recruteurId.toString());

    console.log('Envoi upload logo:', {
      recruteurId,
      fileName: logo.name,
      fileSize: logo.size,
      fileType: logo.type,
      url: `${this.BASE_URL}/upload-logo`
    });

    return this.http.post(`${this.BASE_URL}/upload-logo`, formData, {
      responseType: 'text' // Le backend retourne un String
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur HTTP upload:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });

        // Retourner un message d'erreur plus détaillé
        const errorMessage = error.error || error.message || 'Erreur inconnue';
        return throwError(() => new Error(`Upload échoué (${error.status}): ${errorMessage}`));
      })
    );
  }

  updateRecruteur(id: number, recruteur: Recruteur): Observable<Recruteur> {
    return this.http.put<Recruteur>(`${this.BASE_URL}/recruteurs/${id}`, recruteur).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error || error.message || 'Erreur lors de la modification';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteRecruteur(id: number): Observable<string> {
    return this.http.delete(`${this.BASE_URL}/${id}`, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error || error.message || 'Erreur lors de la suppression';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getLogoEntrepriseUrl(recruteurId: number): Observable<string> {
    return this.http.get(`${this.BASE_URL}/${recruteurId}/logo`, {
      responseType: 'blob'
    }).pipe(
      map((blob: Blob) => URL.createObjectURL(blob))
    );
  }

  getLogoEntreprise(recruteurId: number): Observable<SafeUrl> {
    return this.http.get(`${this.BASE_URL}/${recruteurId}/logo`, {
      responseType: 'blob'
    }).pipe(
      map((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    );
  }

  validerRecruteur(recruteurId: number): Observable<Recruteur> {
    return this.http.put<Recruteur>(
      `${this.BASE_URL}/admin/recruteurs/${recruteurId}/valider`,
      {}
    );
  }

  

  refuserRecruteur(recruteurId: number, commentaire: string): Observable<Recruteur> {
    const params = new HttpParams().set('commentaireRefus', commentaire);
    
    console.log('Refus recruteur:', {
      recruteurId,
      commentaire,
      url: `${this.BASE_URL}/admin/recruteurs/${recruteurId}/refuser`
    });

    return this.http.put<Recruteur>(
      `${this.BASE_URL}/admin/recruteurs/${recruteurId}/refuser`,
      {},
      { params }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur refus:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        const errorMsg = error.error?.message || error.message || 'Erreur lors du refus';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}