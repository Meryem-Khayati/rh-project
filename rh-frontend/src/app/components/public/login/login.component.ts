import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Credentials, LoginService } from '../../../services/auth/login.service';
import { NgClass, NgIf } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink, NavbarComponent,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  loading = false;
  errorMessage: string | null = null;
  errorType: 'error' | 'warning' | 'info' = 'error';
  showPassword = false;
  private subs = new Subscription();

  constructor() {
    this.loadRememberedUser();
  }

  /**
   * Soumission du formulaire de connexion
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.errorMessage = null;
    this.loading = true;

    const credentials: Credentials = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!
    };

    this.subs.add(
      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;

          // Gérer "Se souvenir de moi"
          if (this.loginForm.value.rememberMe) {
            this.rememberUser(this.loginForm.value.username!);
          } else {
            this.forgetUser();
          }

          // Redirection selon le rôle de l'utilisateur
          const userRole = response?.role;

          switch (userRole) {
            case 'ADMIN':
              this.router.navigate(['/dash-admin']);
              break;
            case 'RECRUTEUR':
              this.router.navigate(['/dash-recruteur']);
              break;
            case 'CANDIDAT':
              this.router.navigate(['/dash-candidat']);
              break;
            default:
              this.router.navigate(['']);
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error:', err);

          // Gestion des erreurs personnalisées du backend
          if (err.error?.code === 'RECRUITER_PENDING') {
            this.errorType = 'warning';
            this.errorMessage = 'Votre compte recruteur est en attente de validation par l\'administration. Vous recevrez un email dès que votre compte sera approuvé.';
          } else if (err.error?.code === 'RECRUITER_REJECTED') {
            this.errorType = 'error';
            this.errorMessage = err.error.error || 'Votre compte recruteur a été refusé. Veuillez contacter l\'administration.';
          } else if (err.error?.code === 'BAD_CREDENTIALS') {
            this.errorType = 'error';
            this.errorMessage = 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
          } else if (err.status === 401) {
            this.errorType = 'error';
            this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
          } else if (err.status === 403) {
            this.errorType = 'error';
            this.errorMessage = 'Accès refusé. Votre compte pourrait être désactivé.';
          } else if (err.status === 0) {
            this.errorType = 'error';
            this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
          } else {
            this.errorType = 'error';
            this.errorMessage = err.error?.error || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
          }
        }
      })
    );
  }

  /**
   * Basculer l'affichage du mot de passe
   */
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Sauvegarder l'utilisateur pour "Se souvenir de moi"
   */
  private rememberUser(username: string): void {
    const userData = {
      username: username,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('rememberedUser', btoa(JSON.stringify(userData)));
  }

  /**
   * Charger l'utilisateur sauvegardé
   */
  private loadRememberedUser(): void {
    try {
      const rememberedData = localStorage.getItem('rememberedUser');
      if (rememberedData) {
        const userData = JSON.parse(atob(rememberedData));

        // Vérifier si les données ne sont pas trop anciennes (30 jours)
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        if (new Date().getTime() - userData.timestamp < oneMonth) {
          this.loginForm.patchValue({
            username: userData.username || '',
            rememberMe: true
          });
        } else {
          this.forgetUser();
        }
      }
    } catch (e) {
      console.error('Error loading remembered user:', e);
      this.forgetUser();
    }
  }

  /**
   * Effacer les données "Se souvenir de moi"
   */
  private forgetUser(): void {
    localStorage.removeItem('rememberedUser');
  }

  /**
   * Obtenir les classes CSS selon le type d'erreur
   */
  getErrorClasses(): string {
    const baseClasses = 'mb-4 p-4 rounded-lg text-sm border';
    
    switch (this.errorType) {
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseClasses} bg-red-50 border-red-200 text-red-600`;
    }
  }

  /**
   * Obtenir l'icône selon le type d'erreur
   */
  getErrorIcon(): string {
    switch (this.errorType) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}