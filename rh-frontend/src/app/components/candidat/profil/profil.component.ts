import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // Ajouté
import { Candidat } from '../../../models/Candidat';
import { CandidatService } from '../../../services/candidat/candidat.service';
import { CvService, DeleteCVResponse } from '../../../services/cv/cv.service';
import { LoginService } from '../../../services/auth/login.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfilComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  candidat: Candidat = {
    nom: '',
    prenom: '',
    username: '',
    numtelephone: '',
    adresse: ''
  };
  
  // État séparé pour la modification et le CV
  isLoading = true;
  isEditingProfile = false;
  isEditingCV = false;
  
  // Variables pour la suppression de compte
  showDeleteAccountModal = false;
  isDeletingAccount = false;
  isDeletingCV = false;
  confirmUnderstand = false;
  confirmDataLoss = false;
  confirmIrreversible = false;
  confirmationText = '';
  requiredText = 'SUPPRIMER MON COMPTE';
  
  cvFile: File | null = null;
  cvFileName = '';
  hasCV = false;
  isUploadingCV = false;
  isDownloadingCV = false;
  isCheckingCV = false;
  errorMessage = '';
  successMessage = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private candidatService: CandidatService,
    private cvService: CvService,
    private loginService: LoginService,
    private router: Router // Ajouté
  ) {}

  ngOnInit(): void {
    this.loadProfil();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProfil(): void {
    this.isLoading = true;
    const userId = this.loginService.getUserIdd();
    
    if (!userId) {
      this.errorMessage = 'Utilisateur non connecté';
      this.isLoading = false;
      return;
    }

    const sub = this.candidatService.getCandidatById(userId).subscribe({
      next: (data) => {
        this.candidat = data;
        this.checkForCV();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement du profil';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  checkForCV(): void {
    if (!this.candidat.id) return;
    
    this.isCheckingCV = true;
    const sub = this.cvService.hasCV(this.candidat.id).subscribe({
      next: (hasCV) => {
        this.hasCV = hasCV;
        this.isCheckingCV = false;
      },
      error: (error) => {
        console.error('Erreur lors de la vérification du CV:', error);
        this.hasCV = false;
        this.isCheckingCV = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    if (!this.isEditingProfile) {
      this.loadProfil();
    }
  }

  toggleEditCV(): void {
    this.isEditingCV = !this.isEditingCV;
    this.cvFile = null;
    this.cvFileName = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validation du type de fichier
      if (!file.type.includes('pdf') && !file.type.includes('msword') && !file.type.includes('document')) {
        this.errorMessage = 'Seuls les fichiers PDF et DOC/DOCX sont acceptés';
        input.value = '';
        return;
      }

      // Validation de la taille
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'Le fichier est trop volumineux (max 10MB)';
        input.value = '';
        return;
      }

      this.cvFile = file;
      this.cvFileName = file.name;
      this.errorMessage = '';
    }
  }

  uploadOrReplaceCV(): void {
    if (!this.cvFile || !this.candidat.id) {
      this.errorMessage = 'Veuillez sélectionner un fichier';
      return;
    }

    this.isUploadingCV = true;
    this.errorMessage = '';
    
    const sub = this.cvService.uploadCV(this.cvFile, this.candidat.id).subscribe({
      next: () => {
        this.successMessage = this.hasCV 
          ? 'CV remplacé avec succès' 
          : 'CV téléchargé avec succès';
        this.hasCV = true;
        this.cvFile = null;
        this.cvFileName = '';
        this.isEditingCV = false;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.isUploadingCV = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du téléchargement du CV';
        this.isUploadingCV = false;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  downloadCV(): void {
    if (!this.candidat.id) return;

    this.isDownloadingCV = true;
    const sub = this.cvService.downloadCV(this.candidat.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${this.candidat.nom}_${this.candidat.prenom}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isDownloadingCV = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du téléchargement du CV';
        this.isDownloadingCV = false;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  viewCV(): void {
    if (this.candidat.id) {
      this.cvService.openCVInNewTab(this.candidat.id);
    }
  }

  updateProfil(): void {
    if (!this.candidat.id) return;

    // Validation
    if (!this.candidat.nom || !this.candidat.prenom || !this.candidat.username) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const { id, ...candidatData } = this.candidat;
    
    const sub = this.candidatService.updateCandidat(id, candidatData).subscribe({
      next: (response) => {
        this.successMessage = 'Profil mis à jour avec succès';
        this.isEditingProfile = false;
        this.loadProfil();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  deleteCV(): void {
    if (!this.candidat.id) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer votre CV ? Cette action est irréversible.')) {
      return;
    }

    const sub = this.cvService.deleteCV(this.candidat.id).subscribe({
      next: (response: DeleteCVResponse) => {
        if (response.success) {
          this.successMessage = response.message || 'CV supprimé avec succès';
          this.hasCV = false;
          this.cvFile = null;
          this.cvFileName = '';
          this.isEditingCV = false;
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Erreur lors de la suppression du CV';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors de la suppression du CV';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // === Méthodes pour la suppression de compte ===
  openDeleteAccountModal(): void {
    this.showDeleteAccountModal = true;
    this.confirmUnderstand = false;
    this.confirmDataLoss = false;
    this.confirmIrreversible = false;
    this.confirmationText = '';
  }

  closeDeleteAccountModal(): void {
    this.showDeleteAccountModal = false;
    this.isDeletingAccount = false;
  }

  canDeleteAccount(): boolean {
    return this.confirmUnderstand && 
           this.confirmDataLoss && 
           this.confirmIrreversible && 
           this.confirmationText === this.requiredText;
  }

  deleteAccount(): void {
    if (!this.canDeleteAccount() || !this.candidat.id) return;

    this.isDeletingAccount = true;

    // Si le candidat a un CV, on le supprime d'abord
    if (this.hasCV) {
      this.isDeletingCV = true;
      this.cvService.deleteCV(this.candidat.id).subscribe({
        next: () => {
          this.isDeletingCV = false;
          this.deleteCandidatAccount();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du CV: ' + error.message;
          this.isDeletingAccount = false;
          this.isDeletingCV = false;
        }
      });
    } else {
      this.deleteCandidatAccount();
    }
  }

  private deleteCandidatAccount(): void {
    if (!this.candidat.id) return;

    this.candidatService.deleteCandidat(this.candidat.id).subscribe({
      next: (message: string) => {
        this.isDeletingAccount = false;
        this.closeDeleteAccountModal();
        
        // Déconnexion et redirection
        this.loginService.logout();
        this.router.navigate(['/login']);
        
        // Message de confirmation (peut être affiché sur la page de login)
        alert('Votre compte a été supprimé avec succès.');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du compte: ' + err.message;
        this.isDeletingAccount = false;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}