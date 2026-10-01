import { Component } from '@angular/core';
import { RecruteurService } from '../../../services/recruteur/recruteur.service';
import { Router } from '@angular/router';
import { Recruteur } from '../../../models/Recruteur';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-register-recruteur',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './register-recruteur.component.html',
  styleUrl: './register-recruteur.component.css'
})
export class RegisterRecruteurComponent {
  formData = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    nomEntreprise: '',
    adresseEntreprise: '',
    telephoneEntreprise: '',
    siteWeb: '',
    descriptionEntreprise: '',
    numeroCIN: '',
    password: ''
  };

  isSubmitting = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';
  selectedLogo: File | null = null;
  selectedLogoName = '';
  selectedLogoUrl: string | null = null;

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validation
      if (file.size > 1 * 1024 * 1024) {
        this.showModalWithMessage('Erreur', 'Le logo ne doit pas dépasser 1 Mo.', 'error');
        this.resetLogo();
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        this.showModalWithMessage('Erreur', 'Formats autorisés : PNG, JPG, SVG.', 'error');
        this.resetLogo();
        return;
      }

      this.selectedLogo = file;
      this.selectedLogoName = file.name;

      // Aperçu visuel
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedLogoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resetLogo() {
    this.selectedLogo = null;
    this.selectedLogoName = '';
    this.selectedLogoUrl = null;
    const input = document.getElementById('logoInput') as HTMLInputElement;
    if (input) input.value = '';
  }


  constructor(
    private recruteurService: RecruteurService,
    private router: Router
  ) { }

  isFormValid(): boolean {
    return (
      this.formData.prenom.trim() !== '' &&
      this.formData.nom.trim() !== '' &&
      this.formData.email.includes('@') &&
      this.formData.telephone.trim() !== '' &&
      this.formData.nomEntreprise.trim() !== '' &&
      this.formData.adresseEntreprise.trim() !== '' &&
      this.formData.telephoneEntreprise.trim() !== '' &&
      this.formData.descriptionEntreprise.trim() !== '' &&
      this.formData.password.length >= 6
    );
  }

  showModalWithMessage(title: string, message: string, type: 'success' | 'error') {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
    if (type === 'success') {
      setTimeout(() => this.closeModal(), 3000);
    }
  }

  closeModal() {
    this.showModal = false;
  }

  // Dans onSubmit(), remplacez l'appel à addRecruteur par un upload multipart
  onSubmit() {
    if (!this.isFormValid()) {
      this.showModalWithMessage('⚠️ Attention', 'Veuillez remplir les champs obligatoires.', 'error');
      return;
    }

    this.isSubmitting = true;

    // 1. Créer le recruteur SANS logo
    const recruteurData = {
      prenom: this.formData.prenom.trim(),
      nom: this.formData.nom.trim(),
      username: this.formData.email.trim(),
      numtelephone: this.formData.telephone.trim(),
      nomEntreprise: this.formData.nomEntreprise.trim(),
      adresseEntreprise: this.formData.adresseEntreprise.trim(),
      telephoneEntreprise: this.formData.telephoneEntreprise.trim(),
      siteWeb: this.formData.siteWeb.trim(),
      descriptionEntreprise: this.formData.descriptionEntreprise.trim(),
      numeroCIN: this.formData.numeroCIN.trim(),
      password: this.formData.password,
    };

    this.recruteurService.addRecruteur(recruteurData).subscribe({
      next: (savedRecruteur) => {
        console.log('Recruteur créé:', savedRecruteur);

        // 2. Si logo fourni ET ID reçu → upload
        if (this.selectedLogo && savedRecruteur.id) {
          console.log('📤 Upload du logo pour ID:', savedRecruteur.id);

          this.recruteurService.uploadLogo(savedRecruteur.id, this.selectedLogo).subscribe({
            next: (response) => {
              console.log('Logo uploadé avec succès:', response);
              this.isSubmitting = false;
              this.showModalWithMessage(
                'Compte créé !',
                'Votre compte est en attente de validation par l\'administration.\n\n' +
                'Vous recevrez un email dès qu\'il sera approuvé.\n' +
                'Merci de patienter.',
                'success'
              );
              setTimeout(() => this.router.navigate(['/login']), 2500);
            },
            error: (error) => {
              console.error('ERREUR UPLOAD LOGO - Détails complets:', {
                error: error,
                message: error.message,
                status: error.status,
                statusText: error.statusText,
                errorObject: error.error
              });
              this.isSubmitting = false;
              this.showModalWithMessage(
                'Compte créé !',
                'Votre compte est en attente de validation par l\'administration.\n\n' +
                'Vous recevrez un email sous peu.\n' +
                'Une erreur est survenue lors de l\'upload du logo — vous pourrez le mettre à jour plus tard.',
                'success'
              );
              // Redirection quand même après 3s
              setTimeout(() => this.router.navigate(['/login']), 3000);
            }
          });
        } else {
          // Pas de logo → succès immédiat
          this.isSubmitting = false;
          this.showModalWithMessage(
            'Succès',
            'Compte créé avec succès.',
            'success'
          );
          setTimeout(() => this.router.navigate(['/login']), 2500);
        }
      },
      error: (error) => {
        console.error('Erreur création recruteur:', error);
        this.isSubmitting = false;
        this.showModalWithMessage(
          'Erreur',
          error.message || 'Une erreur est survenue. Veuillez réessayer.',
          'error'
        );
      }
    });
  }
}
