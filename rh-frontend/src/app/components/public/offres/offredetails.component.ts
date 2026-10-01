import { Component, OnInit } from '@angular/core';
import { OffreemploiService } from '../../../services/offre/offreemploi.service';
import { CandidatureService } from '../../../services/candidatures/candidature.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginService } from '../../../services/auth/login.service';
import { Router } from '@angular/router';

interface Offre {
  id: number;
  titre: string;
  description: string;
  localisation: string;
  salaire: number;
  datePublication: string;
  statut: string;
  typeContrat: string;
  recruteur: {
    id: number;
    nom: string;
    prenom: string;
    adresseEntreprise: string;
    nomEntreprise: string;
    siteWeb: string;
    telephoneEntreprise: string;
    descriptionEntreprise: string;
    logoEntreprise: string;
  };
  competences: {
    id: number;
    nom: string;
    niveau: string;
  }[];
}

interface Filters {
  typeContrat: string[];
  entreprise: string[];
  localisation: string[];
  statut: string[];
}

@Component({
  selector: 'app-offredetails',
  imports: [NavbarComponent],
  templateUrl: './offredetails.component.html',
  styleUrl: './offredetails.component.css'
})
export class OffredetailsComponent implements OnInit {
  offres: Offre[] = [];
  filteredOffres: Offre[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  candidatId = 1;

  // Filtres
  filters: Filters = {
    typeContrat: [],
    entreprise: [],
    localisation: [],
    statut: []
  };

  // Exposer Math.min au template
  protected readonly Math = Math;

  constructor(
    private offreService: OffreemploiService,
    private candidatureService: CandidatureService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.offreService.getOffresDetails().subscribe(
      data => {
        this.offres = data;
        console.log(data);
        this.filterOffres();
      },
      error => {
        console.error('Erreur lors du chargement des offres :', error);
      }
    );
  }

  // === MÉTHODES DE FILTRAGE ===

  filterOffres(): void {
    let result = [...this.offres];

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(offre =>
        offre.titre.toLowerCase().includes(query) ||
        offre.recruteur.nomEntreprise.toLowerCase().includes(query) ||
        offre.competences.some(comp => comp.nom.toLowerCase().includes(query))
      );
    }

    // Filtres par type de contrat
    if (this.filters.typeContrat.length > 0) {
      result = result.filter(offre => 
        this.filters.typeContrat.includes(offre.typeContrat)
      );
    }

    // Filtres par entreprise
    if (this.filters.entreprise.length > 0) {
      result = result.filter(offre => 
        this.filters.entreprise.includes(offre.recruteur.nomEntreprise)
      );
    }

    // Filtres par localisation
    if (this.filters.localisation.length > 0) {
      result = result.filter(offre => 
        this.filters.localisation.includes(offre.localisation)
      );
    }

    // Filtres par statut
    if (this.filters.statut.length > 0) {
      result = result.filter(offre => 
        this.filters.statut.includes(offre.statut)
      );
    }

    this.filteredOffres = result;
    this.currentPage = 1; // Réinitialiser à la page 1 lors du filtrage
  }

  toggleFilter(filterType: keyof Filters, value: string): void {
    const filterArray = this.filters[filterType];
    const index = filterArray.indexOf(value);
    
    if (index > -1) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }
    
    this.filterOffres();
  }

  resetFilters(): void {
    this.filters = {
      typeContrat: [],
      entreprise: [],
      localisation: [],
      statut: []
    };
    this.searchQuery = '';
    this.filterOffres();
  }

  hasActiveFilters(): boolean {
    return this.filters.typeContrat.length > 0 ||
           this.filters.entreprise.length > 0 ||
           this.filters.localisation.length > 0 ||
           this.filters.statut.length > 0;
  }

  getActiveFiltersArray(): string[] {
    return [
      ...this.filters.typeContrat,
      ...this.filters.entreprise,
      ...this.filters.localisation,
      ...this.filters.statut
    ];
  }

  removeActiveFilter(value: string): void {
    // Parcourir tous les types de filtres pour trouver et supprimer la valeur
    (Object.keys(this.filters) as Array<keyof Filters>).forEach(key => {
      const index = this.filters[key].indexOf(value);
      if (index > -1) {
        this.filters[key].splice(index, 1);
      }
    });
    this.filterOffres();
  }

  // === MÉTHODES POUR OBTENIR LES VALEURS UNIQUES ===

  getUniqueTypeContrats(): string[] {
    return [...new Set(this.offres.map(o => o.typeContrat))].sort();
  }

  getUniqueEntreprises(): string[] {
    return [...new Set(this.offres.map(o => o.recruteur.nomEntreprise))].sort();
  }

  getUniqueLocalisations(): string[] {
    return [...new Set(this.offres.map(o => o.localisation))].sort();
  }

  getUniqueStatuts(): string[] {
    return [...new Set(this.offres.map(o => o.statut))].sort();
  }

  // === MÉTHODES POUR COMPTER LES RÉSULTATS PAR FILTRE ===

  getCountByFilter(filterType: string, value: string): number {
    let tempOffres = [...this.offres];

    // Appliquer la recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      tempOffres = tempOffres.filter(offre =>
        offre.titre.toLowerCase().includes(query) ||
        offre.recruteur.nomEntreprise.toLowerCase().includes(query) ||
        offre.competences.some(comp => comp.nom.toLowerCase().includes(query))
      );
    }

    // Appliquer les autres filtres (sauf celui en cours)
    if (filterType !== 'typeContrat' && this.filters.typeContrat.length > 0) {
      tempOffres = tempOffres.filter(o => this.filters.typeContrat.includes(o.typeContrat));
    }
    if (filterType !== 'entreprise' && this.filters.entreprise.length > 0) {
      tempOffres = tempOffres.filter(o => this.filters.entreprise.includes(o.recruteur.nomEntreprise));
    }
    if (filterType !== 'localisation' && this.filters.localisation.length > 0) {
      tempOffres = tempOffres.filter(o => this.filters.localisation.includes(o.localisation));
    }
    if (filterType !== 'statut' && this.filters.statut.length > 0) {
      tempOffres = tempOffres.filter(o => this.filters.statut.includes(o.statut));
    }

    // Compter pour la valeur spécifique
    switch (filterType) {
      case 'typeContrat':
        return tempOffres.filter(o => o.typeContrat === value).length;
      case 'entreprise':
        return tempOffres.filter(o => o.recruteur.nomEntreprise === value).length;
      case 'localisation':
        return tempOffres.filter(o => o.localisation === value).length;
      case 'statut':
        return tempOffres.filter(o => o.statut === value).length;
      default:
        return 0;
    }
  }

  // === PAGINATION ===

  get paginatedOffres(): Offre[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOffres.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredOffres.length / this.itemsPerPage);
  }

  setPage(page: any): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getPagesArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // === POSTULER ===

  postuler(offreId: number): void {
    console.log(offreId)
    // Vérifier si l'utilisateur est connecté
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier le rôle
    const role = this.loginService.getUserRole();
    if (role !== 'CANDIDAT') {
      this.showModalWithMessage(
        'Accès refusé',
        'Seuls les candidats peuvent postuler à une offre.',
        'error'
      );
      return;
    }

    // Récupérer l'id du candidat depuis le token
    const candidatId = this.loginService.getUserIdd();

    if (!candidatId) {
      this.router.navigate(['/login']);
      return;
    }

    // Création de la candidature
    const candidature = {
      candidatId: candidatId,
      offreEmploiId: offreId
    };
    console.log(candidature)

    this.candidatureService.addCandidature(candidature).subscribe({
      next: (rep) => {
        console.log(rep)
        this.showModalWithMessage(
          'Succès',
          rep.message,
          'success'
        );
      },
      error: (err) => {
        console.log(err)
        this.showModalWithMessage(
          'Erreur',
          err.error?.message || 'Erreur lors de la candidature',
          'error'
        );
      }
    });
  }

  // === MODAL ===

  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';

  showModalWithMessage(title: string, message: string, type: 'success' | 'error') {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}