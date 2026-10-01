import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from '../../../../services/candidatures/candidature.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidature',
  imports: [ReactiveFormsModule, CommonModule,FormsModule],  
  standalone: true,
  templateUrl: './candidature.component.html',
  styleUrl: './candidature.component.css'
})
export class CandidatureComponent implements OnInit {

  candidatures: any[] = [];
  candidaturesFiltrees: any[] = [];
  offreID!: number;
  candidats: any;
  candidat: any;
  cv: any;
  showFormAccepter = false;
  showFormRefuser = false;
  
  // Filtre
  selectedStatut: string = 'TOUS';
  statuts: { value: string; label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private candidatureService: CandidatureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offreID = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Offre ID récupéré depuis URL :', this.offreID);

    this.getCandidaturesWithCandidatByOffreId();
  }

  getCandidaturesWithCandidatByOffreId() {
    this.candidatureService
      .getCandidaturesByOffreID(this.offreID)
      .subscribe({
        next: (rep) => {
          this.candidatures = rep;
          this.extraireStatuts();
          this.appliquerFiltre();
        },
        error: (err) => console.log(err)
      });
  }

  // Méthode pour extraire les statuts uniques des candidatures
  extraireStatuts() {
    // Extraire les statuts uniques
    const statutsUniques = [...new Set(this.candidatures.map(c => c.statut))];
    
    // Créer le tableau de statuts avec labels
    this.statuts = [
      { value: 'TOUS', label: 'Tous les statuts' },
      ...statutsUniques.map(statut => ({
        value: statut,
        label: this.formatStatutLabel(statut)
      }))
    ];
  }

  // Méthode pour formater le label du statut
  formatStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'ACCEPTEE': 'Acceptée',
      'REFUSEE': 'Refusée'
    };
    return labels[statut] || statut;
  }

  // Méthode pour filtrer les candidatures
  appliquerFiltre() {
    if (this.selectedStatut === 'TOUS') {
      this.candidaturesFiltrees = this.candidatures;
    } else {
      this.candidaturesFiltrees = this.candidatures.filter(
        candidature => candidature.statut === this.selectedStatut
      );
    }
  }

  // Méthode appelée lors du changement de filtre
  onStatutChange(statut: string) {
    this.selectedStatut = statut;
    this.appliquerFiltre();
  }

  // Compter les candidatures par statut
  compterParStatut(statut: string): number {
    if (statut === 'TOUS') {
      return this.candidatures.length;
    }
    return this.candidatures.filter(c => c.statut === statut).length;
  }

  voirCv(candidatId: number) {
    this.candidatureService.getCvByCandidatId(candidatId).subscribe({
      next: (cv) => {
        const byteCharacters = atob(cv.urlFichier);
        const byteNumbers = new Array(byteCharacters.length);
  
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: cv.typeFichier });
  
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: err => {
        console.error('Erreur chargement CV', err);
      }
    });
  }
  
  setShowForm(add: boolean, update: boolean, candidats?: any) {
    this.showFormAccepter = add;
    this.showFormRefuser = update;
    this.candidats = candidats;
  }

  formGroup = new FormGroup({
    sujet: new FormControl('', [Validators.required, Validators.minLength(2)]),
    message: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  accepter() {
    const formData = new FormData();
  
    formData.append('email', this.candidats.candidatDTO.username);
    formData.append('sujet', this.formGroup.get('sujet')!.value as string);
    formData.append('message', this.formGroup.get('message')!.value as string);
  
    this.candidatureService
      .accepterCandidature(this.candidats.id, formData)
      .subscribe({
        next: (res) => {
          console.log('Candidature acceptée', res);
          this.showFormAccepter = false;
          this.showModalWithMessage('Succès', res.message, 'success');
          this.getCandidaturesWithCandidatByOffreId();
        },
        error: (err) => {
          console.error('Erreur', err);
          this.showModalWithMessage(
            'Erreur',
            err.error?.message || 'Erreur lors de l\'acceptation',
            'error'
          );
        }
      });
  }
  
  refuser() {
    const formData = new FormData();
  
    formData.append('email', this.candidats.candidatDTO.username);
    formData.append('sujet', this.formGroup.get('sujet')!.value as string);
    formData.append('message', this.formGroup.get('message')!.value as string);
  
    this.candidatureService
      .refuserCandidature(this.candidats.id, formData)
      .subscribe({
        next: (res) => {
          console.log('Candidature refusée', res);
          this.showModalWithMessage('Succès', res.message, 'success');
          this.showFormRefuser = false;
          this.getCandidaturesWithCandidatByOffreId();
        },
        error: (err) => {
          console.error('Erreur', err);
          this.showModalWithMessage(
            'Erreur',
            err.error?.message || 'Erreur lors du refus',
            'error'
          );
        }
      });
  }

  consulterEntretien(candidatureid: any) {
    this.router.navigate(
      ['dash-recruteur', 'candidatures', candidatureid, 'entretiens'],
      {
        state: { candidatureid: candidatureid }
      }
    );
  }

  // Pour gérer l'affichage du message du back end 
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