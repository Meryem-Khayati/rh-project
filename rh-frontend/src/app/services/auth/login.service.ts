import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, Observable, of, tap, catchError, throwError } from 'rxjs';
import { User } from '../../models/user.model';

export interface Credentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  error?: string;
  code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  user = signal<User | null | undefined>(undefined);
  private BASE_URL = 'http://localhost:8088';
  private readonly TOKEN_KEY = 'token';

  constructor(private httpClient: HttpClient) {
    // Restauration depuis localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        this.user.set(parsedUser);
      } catch (e) {
        console.error('Erreur lors du parsing de l\'utilisateur stocké', e);
        localStorage.removeItem('user');
      }
    }
  }

  login(credentials: Credentials): Observable<User | null | undefined> {
    return this.httpClient.post<LoginResponse>(
      `${this.BASE_URL}/authentication-service/users/login`, 
      credentials
    ).pipe(
      tap((result: LoginResponse) => {
        // Si la réponse contient une erreur (recruteur en attente ou refusé)
        if (result.error || result.code) {
          // Ne pas stocker l'utilisateur
          throw new Error(JSON.stringify(result));
        }

        // Connexion réussie
        if (result.token && result.user) {
          localStorage.setItem(this.TOKEN_KEY, result.token);
          const user = Object.assign(new User(), result.user);
          localStorage.setItem('user', JSON.stringify(user));
          this.user.set(user);
        }
      }),
      map(() => this.user()),
      catchError((error: HttpErrorResponse) => {
        // Gestion des erreurs
        if (error.error && typeof error.error === 'object') {
          // Erreur structurée du backend
          return throwError(() => ({
            status: error.status,
            error: {
              error: error.error.error || 'Une erreur est survenue',
              code: error.error.code || 'UNKNOWN_ERROR'
            }
          }));
        }
        
        // Erreur générique
        return throwError(() => ({
          status: error.status,
          error: {
            error: error.message || 'Une erreur est survenue lors de la connexion',
            code: 'NETWORK_ERROR'
          }
        }));
      })
    );
  }

  getUser(): Observable<User | null | undefined> {
    return this.httpClient.get<User>(
      `${this.BASE_URL}/authentication-service/users/current`
    ).pipe(
      tap((result: User) => {
        const user = Object.assign(new User(), result);
        localStorage.setItem('user', JSON.stringify(user));
        this.user.set(user);
      }),
      map(() => this.user()),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
        this.logout();
        return of(null);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
    this.user.set(null);
    return of({ message: 'Déconnexté avec succès' });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur lors du décodage du token', e);
      return null;
    }
  }

  getUserId(): number | null {
    const decoded = this.getDecodedToken();
    console.log('Decoded token:', decoded);
    return decoded?.sub || decoded?.userId || null;
  }
  getUserIdd(): number | null {
    const decoded = this.getDecodedToken();
    console.log('Decoded token:', decoded);
    return decoded?.id || decoded?.userId || null;
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null && this.user() !== null;
  }
}