// src/app/services/candidature.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CandidatureDetail } from '../../models/CandidatureDetail';
import { Candidature } from '../../models/Candidature';
import { Entretien } from '../../models/Entretien';

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private BASE_URL = 'http://localhost:8088/candidature-service/candidatures';
  private BASE = 'http://localhost:8088/entretien-service';

  constructor(private http: HttpClient) {}

  getCandidaturesByCandidat(candidatId: number): Observable<CandidatureDetail[]> {
    return this.http.get<CandidatureDetail[]>(
      `${this.BASE_URL}/candidat/${candidatId}/details`
    ).pipe(
      catchError(this.handleError)
    );
  }

  getEntretiensByCandidature(candidatureId: number): Observable<Entretien[]> {
    return this.http.get<Entretien[]>(
      `${this.BASE}/api/entretiens/candidature/${candidatureId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // updateCandidature(id: number, candidature: Candidature): Observable<ApiResponse> {
  //   return this.http.put<ApiResponse>(
  //     `${this.BASE_URL}/candidature-service/candidatures/${id}`,
  //     candidature
  //   ).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // deleteCandidature(id: number): Observable<ApiResponse> {
  //   return this.http.delete<ApiResponse>(
  //     `${this.BASE_URL}/candidature-service/candidatures/${id}`
  //   ).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}