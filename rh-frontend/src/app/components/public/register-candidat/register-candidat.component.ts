import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidatService } from '../../../services/candidat/candidat.service';
import { Candidat } from '../../../models/Candidat';
import { NavbarComponent } from "../navbar/navbar.component";
import { CvService } from '../../../services/cv/cv.service';

@Component({
  selector: 'app-register-candidat',
  imports: [CommonModule, FormsModule, NgIf, NavbarComponent],
  templateUrl: './register-candidat.component.html',
  styleUrl: './register-candidat.component.css'
})
export class RegisterCandidatComponent {

  formData = {
    prenom: '',
    nom: '',
    email: '',
    password: '',
    telephone: '',
    adresse: ''
  };

  selectedFile: File | null = null;
  selectedFileName = '';
  isSubmitting = false;
  errorMessage: string | null = null;
   // Notification
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  // Afficher la notification
  showModalWithMessage(title: string, message: string, type: 'success' | 'error') {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  // Fermer la notification
  closeModal() {
    this.showModal = false;
  }

  constructor(
    private candidatService: CandidatService,
    private router: Router,
    private cvService: CvService

  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.showError('Le CV ne doit pas dépasser 2 Mo.');
        this.resetFileInput();
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        this.showError('Formats autorisés : PDF, DOC, DOCX.');
        this.resetFileInput();
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.clearError();
    }
  }

  resetFileInput() {
    this.selectedFile = null;
    this.selectedFileName = '';
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) input.value = '';
  }

  isFormValid(): boolean {
    return (
      this.formData.prenom.trim() !== '' &&
      this.formData.nom.trim() !== '' &&
      this.formData.email.includes('@') &&
      this.formData.password.length >= 6 &&
      this.formData.telephone.trim() !== '' &&
      this.formData.adresse.trim() !== '' &&
      this.selectedFile !== null
    );
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.clearError(), 5000);
  }

  clearError() {
    this.errorMessage = null;
  }

  onSubmit() {
  if (!this.isFormValid()) {
    this.showModalWithMessage('⚠️ Attention', 'Veuillez remplir tous les champs correctement.', 'error');
    return;
  }

  this.isSubmitting = true;

  const candidat: Candidat = {
    nom: this.formData.nom.trim(),
    prenom: this.formData.prenom.trim(),
    username: this.formData.email.trim(),
    password: this.formData.password,
    numtelephone: this.formData.telephone.trim(),
    adresse: this.formData.adresse.trim()
  };

  this.candidatService.addCandidat(candidat).subscribe({
    next: (savedCandidat) => {
      if (this.selectedFile && savedCandidat.id) {
        this.cvService.uploadCV(this.selectedFile, savedCandidat.id).subscribe({
          next: () => {
            this.showModalWithMessage(
              'Succès',
              'Votre compte et votre CV ont été enregistrés avec succès.',
              'success'
            );
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: () => {
            this.isSubmitting = false;
            // Message fixe pour erreur CV
            this.showModalWithMessage(
              'Erreur',
              'Une erreur est survenue. Veuillez réessayer ou contacter le support.',
              'error'
            );
          }
        });
      } else {
        this.showModalWithMessage(
          'Succès',
          'Compte créé avec succès.',
          'success'
        );
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    },
    error: (err) => {
      this.isSubmitting = false;

      // Détection douce d’erreurs *connues* (optionnel, mais utile)
      let userMessage = 'Une erreur est survenue. Veuillez réessayer ou contacter le support.';

      // Exemple : si le backend renvoie un message explicite en français
      if (err?.message?.includes('email déjà utilisé') || err?.message?.includes('username')) {
        userMessage = 'Cet email est déjà utilisé.';
      }
      // Exemple : si le backend renvoie HTTP 400 avec "duplicate key"
      else if (err?.status === 400 && err?.error?.message?.toLowerCase().includes('duplicate')) {
        userMessage = 'Cet email est déjà utilisé.';
      }

      // Toujours afficher un message fixe — jamais le message brut
      this.showModalWithMessage('Erreur', userMessage, 'error');
    }
  });
}
}