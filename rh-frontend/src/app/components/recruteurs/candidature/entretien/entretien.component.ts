import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntretienService } from '../../../../services/entretien/entretien.service';
import { Entretien } from '../../../../models/Entretien';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entretien',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],  
  templateUrl: './entretien.component.html',
  styleUrl: './entretien.component.css'
})
export class EntretienComponent implements OnInit {
  entretiens: any[] = [];
  entretiensFiltres: any[] = [];
  entretienID: any;
  entretien: any;
  candidatureId: any;
  showAddForm: boolean = false;
  showUpdateForm: boolean = false;
  showList: boolean = true;
  showConfirmModal = false;
  
  // Filtres
  selectedAnnee: string = 'TOUS';
  selectedMois: string = 'TOUS';
  selectedType: string = 'TOUS';
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

  typesEntretien = [
    { code: 'TECHNIQUE', libelle: 'Technique' },
    { code: 'RH', libelle: 'Ressources Humaines' },
    { code: 'MANAGERIAL', libelle: 'Managérial' },
    { code: 'TELEPHONIQUE', libelle: 'Téléphonique' },
    { code: 'VISIO', libelle: 'Visioconférence' },
    { code: 'PRESENTIEL', libelle: 'Présentiel' }
  ];

  typesEntretienFilter: { value: string; label: string }[] = [];

  constructor(private router: Router, private entretienService: EntretienService) { 
    const navigation = this.router.getCurrentNavigation();
    this.candidatureId = navigation?.extras.state?.['candidatureid']
  }

  formGroup = new FormGroup({
    date: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    evaluation: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getEntretiensByIdCandidature();
  }

  getEntretiensByIdCandidature() {
    this.entretienService.getEntretiensByIdcandidature(this.candidatureId).subscribe({
      next: (rep) => { 
        console.log(rep)
        this.entretiens = rep;
        this.extraireAnnees();
        this.extraireTypes();
        this.appliquerFiltres();
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });
  }

  // Extraire les années uniques des dates d'entretien
  extraireAnnees() {
    const anneesUniques = new Set<string>();
    
    this.entretiens.forEach(entretien => {
      if (entretien.date) {
        let annee: string;
        
        if (entretien.date.includes('-')) {
          // Format: "2024-12-27"
          annee = entretien.date.split('-')[0];
        } else if (entretien.date.includes('/')) {
          // Format: "27/12/2024"
          const parts = entretien.date.split('/');
          annee = parts[2];
        } else {
          return;
        }
        
        anneesUniques.add(annee);
      }
    });

    this.annees = ['TOUS', ...Array.from(anneesUniques).sort((a, b) => b.localeCompare(a))];
  }

  // Extraire les types d'entretien uniques
  extraireTypes() {
    const typesUniques = new Set<string>();
    
    this.entretiens.forEach(entretien => {
      if (entretien.type) {
        typesUniques.add(entretien.type);
      }
    });

    this.typesEntretienFilter = [
      { value: 'TOUS', label: 'Tous les types' },
      ...Array.from(typesUniques).map(type => {
        const typeObj = this.typesEntretien.find(t => t.code === type);
        return {
          value: type,
          label: typeObj ? typeObj.libelle : type
        };
      })
    ];
  }

  // Appliquer les filtres
  appliquerFiltres() {
    this.entretiensFiltres = this.entretiens.filter(entretien => {
      // Filtre par année
      if (this.selectedAnnee !== 'TOUS') {
        const anneeEntretien = this.extraireAnnee(entretien.date);
        if (anneeEntretien !== this.selectedAnnee) {
          return false;
        }
      }

      // Filtre par mois
      if (this.selectedMois !== 'TOUS') {
        const moisEntretien = this.extraireMois(entretien.date);
        if (moisEntretien !== this.selectedMois) {
          return false;
        }
      }

      // Filtre par type
      if (this.selectedType !== 'TOUS') {
        if (entretien.type !== this.selectedType) {
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
      return dateStr.split('-')[1];
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      return parts[1].padStart(2, '0');
    }
    return '';
  }

  // Appelé lors du changement de filtre
  onFiltreChange() {
    this.appliquerFiltres();
  }

  // Réinitialiser les filtres
  reinitialiserFiltres() {
    this.selectedAnnee = 'TOUS';
    this.selectedMois = 'TOUS';
    this.selectedType = 'TOUS';
    this.appliquerFiltres();
  }

  // Compter les entretiens par type
  compterParType(type: string): number {
    if (type === 'TOUS') {
      return this.entretiensFiltres.length;
    }
    return this.entretiensFiltres.filter(e => e.type === type).length;
  }

  onSubmit() {
    const ent: Entretien = {
      date: this.formGroup.value.date || '',
      type: this.formGroup.value.type || '',
      evaluation: this.formGroup.value.evaluation || '',
      candidatureId: this.candidatureId
    }
    console.log(ent)
    this.entretienService.addEntretien(ent).subscribe({
      next: (rep) => {
        console.log(rep),
        this.showModalWithMessage('success', rep.message, 'success');   
        this.formGroup.reset();
        this.getEntretiensByIdCandidature();
      },
      error: (err) => { 
        console.log(err)
        this.showModalWithMessage('Erreur', err.error.message, 'error');
      }
    })
  }

  updateEntretient() {
    const entretienUpdated: Entretien = {
      date: this.formGroup.value.date || this.entretien.date,
      type: this.formGroup.value.type || this.entretien.type,
      evaluation: this.formGroup.value.evaluation || this.entretien.evaluation,
      candidatureId: this.candidatureId
    }
    this.entretienService.updateEntretien(this.entretienID, entretienUpdated).subscribe({
      next: (rep) => {
        console.log(rep),
        this.showModalWithMessage('success', 'modifiée', 'success');
        this.getEntretiensByIdCandidature();
      },
      error: (err) => {
        this.showModalWithMessage('Erreur', err.error.message, 'error'); 
      }
    })
  }

  supprimerEntretien() {
    this.showConfirmModal = false
    this.entretienService.deleteEntretien(this.entretienID).subscribe({
      next: (rep) => {
        console.log(rep),
        this.showModalWithMessage('success!', rep.message, 'success');       
        this.getEntretiensByIdCandidature();
      },
      error: (err) => {
        this.showModalWithMessage('Erreur', err.error.message, 'error'); 
        this.getEntretiensByIdCandidature();
      }
    })
  }

  setFormInfoForUpdate() {
    this.entretienService.getEntretienById(this.entretienID).subscribe({
      next: (rep) => {
        console.log('Données reçues:', rep); 
        this.entretien = rep;
        this.formGroup.patchValue({
          date: rep.date,
          type: rep.type,       
          evaluation: rep.evaluation
        });
        console.log('Valeur du type dans le form après patch:', this.formGroup.get('type')?.value);
      },
      error: (err) => console.error(err)
    });
  }

  changeApparaition(showList: any, showAddForm: any, showUpdateForm: any, id: any) {
    this.showList = showList;
    this.showAddForm = showAddForm;
    this.showUpdateForm = showUpdateForm;
    this.entretienID = id
    if (showUpdateForm) {
      this.setFormInfoForUpdate();
    }
  }

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

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  setIdForDelete(id: any) {
    this.entretienID = id;
    this.showConfirmModal = true;
  }
}