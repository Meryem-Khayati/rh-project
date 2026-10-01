import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatureDetail } from '../../../models/CandidatureDetail';
import { Entretien } from '../../../models/Entretien';
import { CandidatureService } from '../../../services/candidature/candidature.service';
import { LoginService } from '../../../services/auth/login.service';


@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suivi.component.html',
  styleUrl: './suivi.component.css'
})
export class SuiviComponent implements OnInit {
  candidatures = signal<CandidatureDetail[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedCandidature = signal<CandidatureDetail | null>(null);
  showOffreModal = signal<boolean>(false);
  showEntretiensModal = signal<boolean>(false);
  
  entretiens = signal<Entretien[]>([]);
  loadingEntretiens = signal<boolean>(false);

  constructor(
    private candidatureService: CandidatureService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.loading.set(true);
    this.error.set(null);

    const candidatId = this.loginService.getUserIdd();
    
    if (!candidatId) {
      this.error.set('Impossible de récupérer l\'ID du candidat');
      this.loading.set(false);
      return;
    }

    this.candidatureService.getCandidaturesByCandidat(candidatId)
      .subscribe({
        next: (data) => {
          this.candidatures.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
        }
      });
  }

  openOffreModal(candidature: CandidatureDetail): void {
    this.selectedCandidature.set(candidature);
    this.showOffreModal.set(true);
  }

  closeOffreModal(): void {
    this.showOffreModal.set(false);
    this.selectedCandidature.set(null);
  }

  openEntretiensModal(candidature: CandidatureDetail): void {
    this.selectedCandidature.set(candidature);
    this.showEntretiensModal.set(true);
    this.loadEntretiens(candidature.id);
  }

  closeEntretiensModal(): void {
    this.showEntretiensModal.set(false);
    this.selectedCandidature.set(null);
    this.entretiens.set([]);
  }

  loadEntretiens(candidatureId: number): void {
    this.loadingEntretiens.set(true);
    this.candidatureService.getEntretiensByCandidature(candidatureId)
      .subscribe({
        next: (data) => {
          this.entretiens.set(data);
          this.loadingEntretiens.set(false);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des entretiens:', err);
          this.entretiens.set([]);
          this.loadingEntretiens.set(false);
        }
      });
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'ACCEPTÉE': 'bg-green-100 text-green-800',
      'REFUSÉE': 'bg-red-100 text-red-800',
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'ANNULÉE': 'bg-gray-100 text-gray-800',
      'Active': 'bg-blue-100 text-blue-800'
    };
    return classes[statut] || 'bg-blue-100 text-blue-800';
  }

  getNiveauClass(niveau: string): string {
    const classes: { [key: string]: string } = {
      'EXPERT': 'bg-purple-100 text-purple-800',
      'Débutant': 'bg-blue-100 text-blue-800',
      'Intermédiaire': 'bg-indigo-100 text-indigo-800'
    };
    return classes[niveau] || 'bg-gray-100 text-gray-800';
  }

  getTypeEntretienClass(type: string): string {
    const classes: { [key: string]: string } = {
      'TECHNIQUE': 'bg-blue-100 text-blue-800',
      'RH': 'bg-green-100 text-green-800',
      'MANAGER': 'bg-purple-100 text-purple-800',
      'FINAL': 'bg-orange-100 text-orange-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }

  getTypeEntretienIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'TECHNIQUE': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      'RH': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      'MANAGER': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'FINAL': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
    };
    return icons[type] || 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
  }

  isAcceptee(candidature: CandidatureDetail): boolean {
    return candidature.statut === 'ACCEPTÉE';
  }

  // Ajoute ces méthodes dans la classe SuiviComponent

getCandidaturesAccepteesCount(): number {
  return this.candidatures().filter(c => c.statut === 'ACCEPTÉE').length;
}

getCandidaturesEnAttenteCount(): number {
  return this.candidatures().filter(c => c.statut === 'EN_ATTENTE').length;
}

getCandidaturesRefuseesCount(): number {
  return this.candidatures().filter(c => c.statut === 'REFUSÉE').length;
}
}