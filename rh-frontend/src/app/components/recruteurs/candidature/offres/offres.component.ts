import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreEmploi } from '../../../../models/OffreEmploi';
import { OffreemploiService } from '../../../../services/offre/offreemploi.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../../services/auth/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offres',
  imports: [CommonModule, FormsModule],  
  templateUrl: './offres.component.html',
  styleUrl: './offres.component.css'
})
export class OffresComponent implements OnInit {
  offres: OffreEmploi[] = [];
  offresFiltrees: OffreEmploi[] = [];
  offreID: any;
  recruteurID: any;
  offre: any;
  
  // Filtres
  selectedAnnee: string = 'TOUS';
  selectedMois: string = 'TOUS';
  annees: string[] = [];
  mois = [
    { value: 'TOUS', label: 'Tous les mois' },
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  constructor(
    private router: Router, 
    private offreService: OffreemploiService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.getRecruteurId();
    this.getOffresByRecruteurId();
  }

  voirCandidatures(offreId: any) {
    this.router.navigate([
      '/dash-recruteur/offresemploi',
      offreId,
      'candidatures'
    ]);
  }

  getRecruteurId() {
    console.log("testtt" + this.loginService.getUserIdd())
    this.recruteurID = this.loginService.getUserIdd()
    return this.loginService.getUserId(); 
  }

  getOffresByRecruteurId() {
    this.offreService.getOffreByRecruteurID(this.recruteurID).subscribe({
      next: (rep) => { 
        console.log(rep)
        this.offres = rep;
        this.extraireAnnees();
        this.appliquerFiltres();
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });
  }

  // Extraire les années uniques des dates de publication
  extraireAnnees() {
    const anneesUniques = new Set<string>();
    
    this.offres.forEach(offre => {
      if (offre.datePublication) {
        // Extraire l'année de la date (format peut être: "2024-12-27" ou "27/12/2024")
        let annee: string;
        
        if (offre.datePublication.includes('-')) {
          // Format: "2024-12-27"
          annee = offre.datePublication.split('-')[0];
        } else if (offre.datePublication.includes('/')) {
          // Format: "27/12/2024"
          const parts = offre.datePublication.split('/');
          annee = parts[2];
        } else {
          return;
        }
        
        anneesUniques.add(annee);
      }
    });

    // Convertir en tableau et trier par ordre décroissant
    this.annees = ['TOUS', ...Array.from(anneesUniques).sort((a, b) => b.localeCompare(a))];
  }

  // Appliquer les filtres
  appliquerFiltres() {
    this.offresFiltrees = this.offres.filter(offre => {
      // Filtre par année
      if (this.selectedAnnee !== 'TOUS') {
        const anneeOffre = this.extraireAnnee(offre.datePublication);
        if (anneeOffre !== this.selectedAnnee) {
          return false;
        }
      }

      // Filtre par mois
      if (this.selectedMois !== 'TOUS') {
        const moisOffre = this.extraireMois(offre.datePublication);
        if (moisOffre !== this.selectedMois) {
          return false;
        }
      }

      return true;
    });
  }

  // Extraire l'année d'une date
  extraireAnnee(dateStr: string): string {
    if (!dateStr) return '';
    
    if (dateStr.includes('-')) {
      return dateStr.split('-')[0];
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      return parts[2];
    }
    return '';
  }

  // Extraire le mois d'une date
  extraireMois(dateStr: string): string {
    if (!dateStr) return '';
    
    if (dateStr.includes('-')) {
      // Format: "2024-12-27"
      return dateStr.split('-')[1];
    } else if (dateStr.includes('/')) {
      // Format: "27/12/2024"
      const parts = dateStr.split('/');
      return parts[1].padStart(2, '0');
    }
    return '';
  }

  // Appelé lors du changement de filtre
  onFiltreChange() {
    this.appliquerFiltres();
  }

  // Compter les offres filtrées
  compterOffres(): number {
    return this.offresFiltrees.length;
  }

  // Compter par statut
  compterParStatut(statut: string): number {
    return this.offresFiltrees.filter(o => o.statut === statut).length;
  }

  // Réinitialiser les filtres
  reinitialiserFiltres() {
    this.selectedAnnee = 'TOUS';
    this.selectedMois = 'TOUS';
    this.appliquerFiltres();
  }
}