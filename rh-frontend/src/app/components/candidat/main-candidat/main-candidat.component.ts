import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidatureService } from '../../../services/candidature/candidature.service';
import { LoginService } from '../../../services/auth/login.service';
import { CandidatureDetail } from '../../../models/CandidatureDetail';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  route?: string;
}

interface RecentCandidature {
  id: number;
  titre: string;
  entreprise: string;
  statut: string;
  dateSoumission: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-candidat.component.html',
  styleUrl: './main-candidat.component.css'
})
export class MainCandidatComponent implements OnInit {
  loading = true;
  stats: StatCard[] = [];
  recentCandidatures: RecentCandidature[] = [];
  allCandidatures: CandidatureDetail[] = [];

  constructor(
    private candidatureService: CandidatureService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    const candidatId = this.loginService.getUserIdd();

    if (!candidatId) {
      console.error('ID candidat non trouvé');
      this.loading = false;
      return;
    }

    this.candidatureService.getCandidaturesByCandidat(candidatId).subscribe({
      next: (candidatures) => {
        this.allCandidatures = candidatures;
        this.calculateStats(candidatures);
        this.extractRecentCandidatures(candidatures);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des candidatures:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(candidatures: CandidatureDetail[]): void {
    const totalCandidatures = candidatures.length;
    const acceptees = candidatures.filter(c => c.statut === 'ACCEPTÉE').length;
    const enAttente = candidatures.filter(c => c.statut === 'EN_ATTENTE').length;
    const refusees = candidatures.filter(c => c.statut === 'REFUSÉE').length;

    this.stats = [
      {
        title: 'Total Candidatures',
        value: totalCandidatures,
        icon: 'clipboard',
        color: 'blue',
        route: '/dash-candidat/suivi'
      },
      {
        title: 'Acceptées',
        value: acceptees,
        icon: 'check-circle',
        color: 'green',
        route: '/dash-candidat/suivi'
      },
      {
        title: 'En Attente',
        value: enAttente,
        icon: 'clock',
        color: 'yellow',
        route: '/dash-candidat/suivi'
      },
      {
        title: 'Refusées',
        value: refusees,
        icon: 'x-circle',
        color: 'red',
        route: '/dash-candidat/suivi'
      }
    ];
  }

  extractRecentCandidatures(candidatures: CandidatureDetail[]): void {
    this.recentCandidatures = candidatures
      .sort((a, b) => new Date(b.dateSoumission).getTime() - new Date(a.dateSoumission).getTime())
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        titre: c.offreEmploi.titre,
        entreprise: c.offreEmploi.localisation,
        statut: c.statut,
        dateSoumission: new Date(c.dateSoumission)
      }));
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'ACCEPTÉE': 'bg-green-100 text-green-800',
      'REFUSÉE': 'bg-red-100 text-red-800',
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'ANNULÉE': 'bg-gray-100 text-gray-800'
    };
    return classes[statut] || 'bg-blue-100 text-blue-800';
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
    
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  navigateToSuivi(): void {
    this.router.navigate(['/dash-candidat/suivi']);
  }

  navigateToProfil(): void {
    this.router.navigate(['/dash-candidat/profil']);
  }
  navigateToOffres(): void {
    this.router.navigate(['/offres']);
  }
}