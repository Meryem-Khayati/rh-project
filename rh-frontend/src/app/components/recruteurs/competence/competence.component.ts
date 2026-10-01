import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Competence } from '../../../models/Competence';
import { CompetenceService } from '../../../services/competence/competence.service';

@Component({
  selector: 'app-competence',
  imports: [ReactiveFormsModule],  
  templateUrl: './competence.component.html',
  styleUrl: './competence.component.css',
  standalone: true
})
export class CompetenceComponent implements OnInit {
  competences: Competence[] = [];
  competenceID: any;
  competence : any;
  showAddForm: boolean = false;
  showUpdateForm: boolean = false;
  showList: boolean = true;

  showConfirmModal = false;
  competenceIdToDelete: number | null = null;


  constructor(private router: Router, private competenceService : CompetenceService) { }

  formGroup = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(1)]),
    niveau: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  ngOnInit(): void {
    this.getCompetences();
  }

  getCompetences() {
    this.competenceService.getCompetences().subscribe({
      next: (rep) => { 
        console.log(rep)
        this.competences = rep 
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });
  }

 
  onSubmit() {
    // recuperer le nom et niveau depuis le form
    const comp: Competence = {
      nom: this.formGroup.value.nom || '',
      niveau: this.formGroup.value.niveau || '',
    }
    this.competenceService.addCompetence(comp).subscribe({
      next: (rep) => {
        console.log(rep),
        this.showModalWithMessage(
          'Succès',
          rep.message,
          'success'
        );
        setTimeout(() => {
        }, 2000); 
        this.formGroup.reset();
        this.getCompetences();
      },
      error: (err) => { 
        console.log(err)
        this.showModalWithMessage(
          'Erreur',
          err.error.message,
          'error'
        );

          }
    })
  }


  setFormInfoForUpdate() {
    this.competenceService.getCompetenceById(this.competenceID).subscribe({
      next: (rep) => {
        this.competence = rep;
        console.log(rep);
        this.formGroup.patchValue({
          nom: rep.nom,
          niveau: rep.niveau
        })
      },
      error: (err) => { console.log("erreur") }
    });
  }


updateCompetence() {
  const competenceUpdated: Competence = {
    nom: this.formGroup.value.nom || this.competence.nom,
    niveau: this.formGroup.value.niveau || this.competence.niveau,
  }
  this.competenceService.updateCompetence(this.competenceID, competenceUpdated).subscribe({
    next: (rep) => {
      console.log(rep),
      this.showModalWithMessage(
        'Succès',
        rep.message,
        'success'
      );
      setTimeout(() => {
      }, 2000);      
       this.getCompetences();
    },
    error: (err) => {
      this.showModalWithMessage(
        'Erreur',
        err.error.message,
        'error'
      ); 
      this.getCompetences();
    }
  })
}


setCompetenceIdForDelete(id: any) {
  this.competenceIdToDelete = id;
  this.showConfirmModal = true;
}

confirmDeleteCompetence() {
  if (!this.competenceIdToDelete) return;

  this.competenceService.deleteCompetence(this.competenceIdToDelete).subscribe({
    next: (rep: any) => {
      if (rep.success) {
        this.competences = this.competences.filter(
          (comp: Competence) => comp.id !== this.competenceIdToDelete
        );

        this.showModalWithMessage(
          'Succès',
          rep.message,
          'success'
        );
      }

      this.closeConfirmModal();
    },
    error: (err) => {
      this.showModalWithMessage(
        'Erreur',
        err.error?.message || 'Erreur lors de la suppression',
        'error'
      );
      this.closeConfirmModal();
    }
  });
}
closeConfirmModal() {
  this.showConfirmModal = false;
  this.competenceIdToDelete = null;
}


  
  changeApparaition(showList:any,showAddForm:any,showUpdateForm:any, id:any){
    this.showList = showList;
    this.showAddForm = showAddForm;
    this.showUpdateForm = showUpdateForm;
    this.competenceID = id
    if(showUpdateForm){
      this.setFormInfoForUpdate();
    }

  }






  
// Pour gérer l'affichage  du messge du back end 
showModal: boolean = false;
modalTitle: string = '';
modalMessage: string = '';
modalType: 'success' | 'error' = 'success';

// Méthode pour afficher la modale
showModalWithMessage(title: string, message: string, type: 'success' | 'error') {
 this.modalTitle = title;
 this.modalMessage = message;
 this.modalType = type;
 this.showModal = true;
}

// Méthode pour fermer la modale de confirmation de supp
closeModal() {
this.showModal = false;
}
}



