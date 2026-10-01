import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Candidat } from '../../models/Candidat';

@Injectable({
  providedIn: 'root'
})
export class CandidatService {
  
  constructor(private http: HttpClient) {
  }

  private BASE_URL = "http://localhost:8088/authentication-service/users";

  getAllCandidats(): Observable<any> {
    return this.http.get(this.BASE_URL + '/candidats')
  }
 

  addCandidat(candidat: Candidat): Observable<Candidat> {
    return this.http.post<Candidat>(`${this.BASE_URL}/register/candidat`, candidat).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message || error.message || 'Erreur lors de l\'inscription';
        return throwError(() => new Error(msg));
      })
    );
  }

  getCandidatById(id: number): Observable<Candidat> {
    return this.http.get<Candidat>(`${this.BASE_URL}/candidats/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCandidat(id: number, candidat: Partial<Candidat>): Observable<any> {
    return this.http.put(this.BASE_URL + '/candidats/' + id, candidat, {responseType: 'text'}).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error || error.message || 'Erreur lors de la modification du candidat';
        return throwError(() => ({message: errorMsg}));
      })
    );
  }


  deleteCandidat(id: number): Observable<string> {
    return this.http.delete(this.BASE_URL + '/' + id, {responseType: 'text'}).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error || error.message || 'Erreur lors de la suppression du responsable';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Une erreur inconnue est survenue.';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMsg = `Erreur client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 400) {
        errorMsg = error.error?.message || 'Données invalides.';
      } else if (error.status === 404) {
        errorMsg = 'Candidat non trouvé.';
      } else if (error.status === 409) {
        errorMsg = 'Ce nom d’utilisateur est déjà utilisé.';
      } else if (error.status === 500) {
        errorMsg = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else {
        errorMsg = `Erreur ${error.status} : ${error.message}`;
        if (error.error?.message) errorMsg = error.error.message;
      }
    }

    return throwError(() => new Error(errorMsg));
  }
}
