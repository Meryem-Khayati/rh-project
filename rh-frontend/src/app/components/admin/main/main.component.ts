import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatService } from '../../../services/candidat/candidat.service';
import { RecruteurService } from '../../../services/recruteur/recruteur.service';

interface StatCard {
  title: string;
  value: number;
  isPositive: boolean;
  icon: string;
  color: string;
}

interface RecentActivity {
  type: 'candidat' | 'recruteur';
  name: string;
  action: string;
  date: Date;
  status?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponenet implements OnInit {
  loading = true;
  stats: StatCard[] = [];
  recentActivities: RecentActivity[] = [];
  
  monthlyData: any[] = [];

  constructor(
    private candidatService: CandidatService,
    private recruteurService: RecruteurService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Charger les statistiques
    Promise.all([
      this.candidatService.getAllCandidats().toPromise(),
      this.recruteurService.getAllRecruteurs().toPromise()
    ]).then(([candidats, recruteurs]) => {
      const totalCandidats = candidats?.length || 0;
      const totalRecruteurs = recruteurs?.length || 0;
      const recruteursEnAttente = recruteurs?.filter(r => r.statutValidation === 'EN_ATTENTE').length || 0;
      const recruteursValides = recruteurs?.filter(r => r.statutValidation === 'APPROUVE').length || 0;

      this.stats = [
        {
          title: 'Total Candidats',
          value: totalCandidats,
          isPositive: true,
          icon: 'users',
          color: 'blue'
        },
        {
          title: 'Total Recruteurs',
          value: totalRecruteurs,
          isPositive: true,
          icon: 'briefcase',
          color: 'green'
        },
        {
          title: 'En Attente',
          value: recruteursEnAttente,
          isPositive: false,
          icon: 'clock',
          color: 'orange'
        },
        {
          title: 'Validés',
          value: recruteursValides,
          isPositive: true,
          icon: 'check',
          color: 'purple'
        }
      ];

      // Générer des activités récentes (simulées pour l'exemple)
      this.recentActivities = this.generateRecentActivities(candidats || [], recruteurs || []);
      
      this.loading = false;
    }).catch(err => {
      console.error('Erreur chargement dashboard:', err);
      this.loading = false;
    });
  }

  generateRecentActivities(candidats: any[], recruteurs: any[]): RecentActivity[] {
    const activities: RecentActivity[] = [];
    
    // Ajouter les derniers candidats
    candidats.slice(0, 3).forEach(c => {
      activities.push({
        type: 'candidat',
        name: `${c.prenom} ${c.nom}`,
        action: 'Nouveau candidat inscrit',
        date: new Date()
      });
    });

    // Ajouter les recruteurs en attente
    recruteurs.filter(r => r.statutValidation === 'EN_ATTENTE').slice(0, 2).forEach(r => {
      activities.push({
        type: 'recruteur',
        name: r.nomEntreprise,
        action: 'Demande de validation',
        date: new Date(r.dateDemandeValidation || Date.now()),
        status: 'EN_ATTENTE'
      });
    });

    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }

  getBarHeight(value: number, type: 'candidats' | 'recruteurs'): string {
    const maxValue = Math.max(
      ...this.monthlyData.map(d => type === 'candidats' ? d.candidats : d.recruteurs)
    );
    return `${(value / maxValue) * 100}%`;
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
    return `Il y a ${diffDays}j`;
  }
}