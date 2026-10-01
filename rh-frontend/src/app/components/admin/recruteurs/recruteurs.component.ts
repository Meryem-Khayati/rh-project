import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Recruteur } from '../../../models/Recruteur';
import { RecruteurService } from '../../../services/recruteur/recruteur.service';
import { NotificationComponent } from "../../notification/notification.component";

@Component({
  selector: 'app-recruteurs',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './recruteurs.component.html',
  styleUrls: ['./recruteurs.component.css']
})
export class RecruteursComponent implements OnInit, OnDestroy {
  allRecruteurs: Recruteur[] = [];
  filteredRecruteurs: Recruteur[] = [];

  loading = true;
  error: string | null = null;

  // Détails
  showDetailsModal = false;
  selectedRecruteur: Recruteur | null = null;

  // Validation
  showValidateModal = false;
  recruteurToValidate: Recruteur | null = null;
  isSubmittingValidation = false;

  // Suppression
  showDeleteModal = false;
  recruteurToDelete: Recruteur | null = null;
  isSubmittingDeletion = false;

  // Refus
  showRefuseModal = false;
  recruteurToRefuse: Recruteur | null = null;
  refusalComment = '';
  isSubmittingRefusal = false;

  // Notifications
  showNotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  // Logos
  logoUrls: Map<number, SafeUrl> = new Map();
  loadingLogos: Set<number> = new Set();

  // Filtre
  selectedStatut = 'TOUS';
  statutOptions = [
    { value: 'TOUS', label: 'Tous les statuts' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'APPROUVE', label: 'Validé' },
    { value: 'REFUSE', label: 'Refusé' }
  ];

  constructor(
    private recruteurService: RecruteurService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadRecruteurs();
  }

  ngOnDestroy(): void {
    this.logoUrls.clear();
    this.loadingLogos.clear();
  }

  // ========== NOTIFICATIONS ==========
  showSuccessNotification(title: string, message: string): void {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = 'success';
    this.showNotification = true;
  }

  showErrorNotification(title: string, message: string): void {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
  }

  closeNotification(): void {
    this.showNotification = false;
  }

  // ========== CHARGEMENT DES DONNÉES ==========
  loadRecruteurs(): void {
    this.loading = true;
    this.error = null;
    this.recruteurService.getAllRecruteurs().subscribe({
      next: (data) => {
        this.allRecruteurs = data;
        this.applyFilter();
        this.loading = false;
        this.loadAllLogos();
      },
      error: (err) => {
        this.error = 'Impossible de charger la liste des recruteurs.';
        this.loading = false;
        console.error('Erreur chargement recruteurs:', err);
        this.showErrorNotification('Erreur', 'Impossible de charger la liste des recruteurs.');
      }
    });
  }

  loadAllLogos(): void {
    this.allRecruteurs.forEach(recruteur => {
      if (recruteur.id) {
        this.loadLogo(recruteur.id);
      }
    });
  }

  loadLogo(recruteurId: number): void {
    if (this.loadingLogos.has(recruteurId) || this.logoUrls.has(recruteurId)) {
      return;
    }

    this.loadingLogos.add(recruteurId);
    this.recruteurService.getLogoEntreprise(recruteurId).subscribe({
      next: (safeUrl) => {
        this.logoUrls.set(recruteurId, safeUrl);
        this.loadingLogos.delete(recruteurId);
      },
      error: (err) => {
        console.log(`Logo non disponible pour le recruteur ${recruteurId}`);
        this.loadingLogos.delete(recruteurId);
      }
    });
  }

  getLogoUrl(recruteurId: number | undefined): SafeUrl | null {
    if (!recruteurId) return null;
    return this.logoUrls.get(recruteurId) || null;
  }

  isLogoLoading(recruteurId: number | undefined): boolean {
    if (!recruteurId) return false;
    return this.loadingLogos.has(recruteurId);
  }

  // ========== FILTRES ==========
  applyFilter(): void {
    if (this.selectedStatut === 'TOUS') {
      this.filteredRecruteurs = [...this.allRecruteurs];
    } else {
      this.filteredRecruteurs = this.allRecruteurs.filter(recruteur =>
        recruteur.statutValidation === this.selectedStatut
      );
    }
  }

  getStatutLabel(value: string): string {
    const option = this.statutOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getStatutClass(statut: string | undefined): string {
    switch (statut) {
      case 'VALIDE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'REFUSE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // ========== MODALES - OUVRIR/FERMER ==========
  // Détails
  viewDetails(recruteur: Recruteur): void {
    this.selectedRecruteur = recruteur;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRecruteur = null;
  }

  // Validation
  openValidateModal(recruteur: Recruteur): void {
    this.recruteurToValidate = recruteur;
    this.showValidateModal = true;
  }

  closeValidateModal(): void {
    this.showValidateModal = false;
    this.recruteurToValidate = null;
    this.isSubmittingValidation = false;
  }

  // Suppression
  openDeleteModal(recruteur: Recruteur): void {
    this.recruteurToDelete = recruteur;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.recruteurToDelete = null;
    this.isSubmittingDeletion = false;
  }

  // Refus
  openRefuseModal(recruteur: Recruteur): void {
    this.recruteurToRefuse = recruteur;
    this.refusalComment = '';
    this.showRefuseModal = true;
  }

  closeRefuseModal(): void {
    this.showRefuseModal = false;
    this.recruteurToRefuse = null;
    this.refusalComment = '';
    this.isSubmittingRefusal = false;
  }

  // ========== ACTIONS ==========
  // Validation
  confirmValidation(): void {
    if (!this.recruteurToValidate?.id) return;

    this.isSubmittingValidation = true;
    this.recruteurService.validerRecruteur(this.recruteurToValidate.id).subscribe({
      next: (updatedRecruteur) => {
        this.updateRecruteurInLists(updatedRecruteur);
        this.closeValidateModal();
        this.showSuccessNotification(
          'Validation réussie',
          `Compte validé avec succès.`
        );
      },
      error: (err) => {
        console.error('Erreur validation:', err);
        this.isSubmittingValidation = false;
        this.showErrorNotification(
          'Échec de validation',
          `Impossible de valider le compte: ${err.message}`
        );
      }
    });
  }

  // Suppression
  confirmDeletion(): void {
    if (!this.recruteurToDelete?.id) return;

    this.isSubmittingDeletion = true;
    this.recruteurService.deleteRecruteur(this.recruteurToDelete.id).subscribe({
      next: (responseMessage) => {
        if (this.recruteurToDelete?.id) {
          this.logoUrls.delete(this.recruteurToDelete.id);
          this.loadingLogos.delete(this.recruteurToDelete.id);
        }

        this.allRecruteurs = this.allRecruteurs.filter(r => r.id !== this.recruteurToDelete?.id);
        this.applyFilter();
        
        this.closeDeleteModal();
        this.showSuccessNotification(
          'Suppression réussie',
          `Le recruteur a été supprimé avec succès.`
        );
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        this.isSubmittingDeletion = false;
        this.showErrorNotification(
          'Échec de suppression',
          `Impossible de supprimer le compte: ${err.message}`
        );
      }
    });
  }

  // Refus
  confirmRefusal(): void {
    if (!this.recruteurToRefuse?.id || !this.refusalComment.trim()) return;

    this.isSubmittingRefusal = true;
    this.recruteurService.refuserRecruteur(
      this.recruteurToRefuse.id,
      this.refusalComment.trim()
    ).subscribe({
      next: (updatedRecruteur) => {
        this.updateRecruteurInLists(updatedRecruteur);
        this.closeRefuseModal();
        this.showSuccessNotification(
          'Refus enregistré',
          `Le compte a été refusé.`
        );
      },
      error: (err) => {
        console.error('Erreur refus:', err);
        this.isSubmittingRefusal = false;
        this.showErrorNotification(
          'Échec du refus',
          `Impossible de refuser le compte: ${err.message}`
        );
      }
    });
  }

  // Méthodes legacy (pour compatibilité)
  validateRecruteur(recruteur: Recruteur): void {
    this.openValidateModal(recruteur);
  }

  deleteRecruteur(recruteur: Recruteur): void {
    this.openDeleteModal(recruteur);
  }

  refuseRecruteur(): void {
    this.confirmRefusal();
  }

  // ========== UTILITAIRES ==========
  private updateRecruteurInLists(updatedRecruteur: Recruteur): void {
    const indexAll = this.allRecruteurs.findIndex(r => r.id === updatedRecruteur.id);
    if (indexAll !== -1) {
      this.allRecruteurs[indexAll] = updatedRecruteur;
    }
    
    this.applyFilter();

    if (this.selectedRecruteur?.id === updatedRecruteur.id) {
      this.selectedRecruteur = updatedRecruteur;
    }
  }
}