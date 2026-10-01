import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CandidatureService } from '../../../services/candidatures/candidature.service';
import { LoginService } from '../../../services/auth/login.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Statistique {
  id: number;
  titre: string;
  datePublication: string;
  nbCandidatures: number;
}

@Component({
  selector: 'app-main-recruteur',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './main-recruteur.component.html',
  styleUrls: ['./main-recruteur.component.css']
})
export class MainRecruteurComponent implements OnInit {
  recruteurId: number | null = null;
  statistique: Statistique[] = [];
  years: number[] = [];
  selectedYear: number | null = null;
  totalCandidatures : number = 0
  nombreOffres:number =0
  stats: any[] = [];

  
  // Configuration complète du graphique
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Candidatures',
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
  };
  
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: { 
        display: false 
      },
      title: {
        display: true,
        text: 'Nombre de candidatures par offre',
        font: { 
          size: 16 
        }
      }
    }
  };
  
  public barChartType: ChartType = 'bar';

  constructor(
    private router: Router,
    private candidatureService: CandidatureService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.getRecruteurId();
    this.getStatistique();
  }

  getRecruteurId() {
    this.recruteurId = this.loginService.getUserIdd();
  }

  getStatistique() {
    if (!this.recruteurId) return;
    
    this.candidatureService.getStatistiqueRecruteur(this.recruteurId).subscribe({
      next: (rep: Statistique[]) => {
        this.calculerResume(rep);
        console.log('Données reçues:', rep);
        this.statistique = rep;
        this.extractYears();
        
        if (this.years.length > 0) {
          this.selectedYear = this.years[0];
          this.updateChart();
        }
      },
      error: (err) => console.error('Erreur lors de la récupération des statistiques:', err)
    });
  }
  

  extractYears() {
    const yearSet = new Set<number>();
    
    this.statistique.forEach(stat => {
      const dateParts = stat.datePublication.split('-');
      const year = parseInt(dateParts[0], 10);
      
      if (!isNaN(year)) {
        yearSet.add(year);
      }
    });
    
    this.years = Array.from(yearSet).sort((a, b) => b - a);
    console.log('Années extraites:', this.years);
  }

  onYearChange(selectedYear: string) {
    const year = parseInt(selectedYear, 10);
    if (!isNaN(year)) {
      this.selectedYear = year;
      this.updateChart();
    }
  }

  updateChart() {
    if (!this.selectedYear) return;

    const filtered = this.statistique.filter(stat => {
      const dateParts = stat.datePublication.split('-');
      const year = parseInt(dateParts[0], 10);
      return year === this.selectedYear;
    });

    console.log('Données filtrées pour', this.selectedYear, ':', filtered);

    // Mettre à jour les données du graphique
    this.barChartData = {
      labels: filtered.map(stat => stat.titre),
      datasets: [{
        data: filtered.map(stat => stat.nbCandidatures),
        label: 'Candidatures',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#1d4ed8',
        borderWidth: 1
      }]
    };

    console.log('Graphique mis à jour - Labels:', this.barChartData.labels);
    console.log('Graphique mis à jour - Data:', this.barChartData.datasets);
  }

  calculerResume(statistiques: Statistique[]) {
    this.nombreOffres = statistiques.length;
  
    this.totalCandidatures = statistiques.reduce(
      (somme, stat) => somme + stat.nbCandidatures,
      0
    );
  
    // ✅ Cards
    this.stats = [
      {
        title: 'Nombre d’offres',
        value: this.nombreOffres,
        icon: 'clipboard',
        color: 'blue'
      },
      {
        title: 'Total candidatures',
        value: this.totalCandidatures,
        icon: 'check-circle',
        color: 'green'
      }
    ];
  }
  
  
}