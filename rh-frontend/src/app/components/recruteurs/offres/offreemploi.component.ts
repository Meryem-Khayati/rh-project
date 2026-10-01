import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OffreEmploi } from '../../../models/OffreEmploi';
import { CompetenceService } from '../../../services/competence/competence.service';
import { OffreemploiService } from '../../../services/offre/offreemploi.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/auth/login.service';



@Component({
  selector: 'app-offreemploi',
  imports: [ReactiveFormsModule,CommonModule],  
  templateUrl: './offreemploi.component.html',
  styleUrl: './offreemploi.component.css',
  standalone: true

})


export class OffreemploiComponent implements OnInit {
  offres: OffreEmploi[] = [];
  offreID: any;
  recruteurID :any;
  offre : any;
  competences:any; // pour stocker les competence d'un offre
  competencesList : any // pour stocker tout les competence afin d'afficher dans le form
  selectedOffre: any = null; //stock l offre 
  typesContrat : any

  showAddForm: boolean = false;
  showUpdateForm: boolean = false;
  showList: boolean = true;
  showDetail = false;
  showConfirmModal = false;


  constructor(private router: Router,
     private offreService : OffreemploiService,
     private competenceService:CompetenceService,
     private loginService: LoginService) { }



  formGroup = new FormGroup({
    titre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
    localisation: new FormControl('', [Validators.required, Validators.minLength(2)]),
    salaire: new FormControl('', [Validators.required, Validators.minLength(2)]),
    typeContrat: new FormControl('', [
      Validators.required
    ]),
    competenceIds: new FormControl<number[]>([], [Validators.required])
  })

  ngOnInit(): void {
   this.getRecruteurId();
    this.getOffresByRecruteurId();
    this.getCompetences();
    this.getContrats();
  }


  getRecruteurId(){
    console.log("testtt"+this.loginService.getUserIdd())
    this.recruteurID = this.loginService.getUserIdd()
    return this.loginService.getUserId(); 
  }

  

  getOffresByRecruteurId() {
    this.offreService.getOffreByRecruteurID(this.recruteurID).subscribe({
      next: (rep) => { 
        console.log(rep)
        this.offres = rep 
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });
  }

  getOffreCompetences(){
    this.competenceService.getCompetencesByIds(this.selectedOffre.competenceIds).subscribe({
      next: (rep) => { 
        console.log(rep)
        this.competences = rep 
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });

  }
  getCompetences(){
    this.competenceService.getCompetences().subscribe({
      next: (rep) => { 
        console.log(rep)
        this.competencesList = rep 
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });

  }
  getContrats(){
    this.offreService.getContrat().subscribe({
      next: (rep) => { 
        console.log(rep)
        this.typesContrat = rep 
        console.log(rep)
      },
      error: (err) => { console.log(err) }
    });

  }
 
  onSubmit() {
    // recuperer le nom et niveau depuis le form
    const offre: OffreEmploi = {
      titre: this.formGroup.value.titre || '',
      description: this.formGroup.value.description || '',
      salaire: this.formGroup.value.salaire || '',
      localisation: this.formGroup.value.localisation || '',
      statut:'Active',
      typeContrat: this.formGroup.value.typeContrat!,

      competenceIds: this.formGroup.value.competenceIds || [],
      recruteurId : this.recruteurID 
    }
    this.offreService.addOffre(offre).subscribe({
      next: (rep) => {
        console.log(rep),
        this.showModalWithMessage(
          'success',
          rep.message,
          'success'
        );   
        this.formGroup.reset();
        this.getOffresByRecruteurId();
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

 
updateOffre() {
  const offreUpdated: OffreEmploi = {
    titre: this.formGroup.value.titre || this.offre.titre,
    description: this.formGroup.value.description || this.offre.description,
    salaire: this.formGroup.value.salaire || this.offre.salaire,
    localisation: this.formGroup.value.localisation || this.offre.localisation,
    typeContrat: this.formGroup.value.typeContrat ?? this.offre.typeContrat,
    competenceIds: this.formGroup.value.competenceIds || this.offre.competenceIds,
    statut:'',
    recruteurId: this.recruteurID
  }
  this.offreService.updateOffre(this.offreID, offreUpdated).subscribe({
    next: (rep) => {
      console.log(rep),
      this.showModalWithMessage(
        'Succès',
        rep.message,
        'success'
      );      
       this.getOffresByRecruteurId();
    },
    error: (err) => {
      this.showModalWithMessage(
        'Erreur',
        err.error.message,
        'error'
      ); 
      this.getOffresByRecruteurId();
    }
  })
}


  setFormInfoForUpdate(id :any) {
    this.offreID = id
    this.offreService.getOffreById(this.offreID).subscribe({
      next: (rep) => {
        this.offre = rep;
  
        this.formGroup.patchValue({
          titre: rep.titre,
          description: rep.description,
          salaire: rep.salaire,
          localisation: rep.localisation,
          typeContrat: rep.typeContrat,
          competenceIds: rep.competenceIds

        });
  
        this.selectedCompetences = this.competencesList.filter(
          (comp: any) => rep.competenceIds.includes(comp.id)
        );
      },
      error: () => console.log("erreur")
    });
  }



  
  deleteOffre() {
  this.offreService.deleteOffre(this.offreID).subscribe({
    next: (rep: any) => {
      this.offres = this.offres.filter(
        (off: any) => off.id !== this.offreID
      );
        this.showConfirmModal=false
        this.showDetail = false
        console.log(rep)
        this.showModalWithMessage(
          'Succès',
          rep.message,
          'success'
        );  
        this.getOffresByRecruteurId()
        
    },
    error: (err) => {
      console.log(err);
      this.showModalWithMessage(
        'Erreur',
        err.error.message,
        'error'
      ); 
    }
  });
}

disactiver(id : any){
  
  this.offreService.desactiverOffre(id).subscribe({
    
    next: (rep) => { 
      console.log(rep)
      this.showModal=true
      this.showModalWithMessage(
        'Succès',
        rep.message,
        'success'
      );  
      this.getOffresByRecruteurId();
    },
    error: (err) => { 
      console.log(err) 
      this.showModal=true

      this.showModalWithMessage(
        'Erreur',
        err.error.message,
        'error'
      ); 
    }
  });


}
  




  changeApparaition(showList:any,showAddForm:any,showUpdateForm:any, id:any){
    this.showList = showList;
    this.showAddForm = showAddForm;
    this.showUpdateForm = showUpdateForm;
    this.offreID = id
    if(showUpdateForm){
      this.setFormInfoForUpdate(id);
    }
 
}


voirPlus(offre: any) {
  this.selectedOffre = offre;
  this.showList = false;
  this.showDetail = true;
  this.getOffreCompetences();
}

retourListe() {
  this.showDetail = false;
  this.showList = true;
  this.selectedOffre = null;
}




// Compétences sélectionnées (objet complet, pas juste les IDs)
selectedCompetences: any[] = [];

// Méthode appelée quand on sélectionne dans le <select>
onSelectCompetence(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const compId = Number(selectElement.value);

  if (compId && !this.isCompetenceAlreadySelected(compId)) {
    // Trouver la compétence complète dans la liste
    const comp = this.competencesList.find((c:any) => c.id === compId);
    if (comp) {
      this.selectedCompetences.push(comp);
      // Mettre à jour le FormControl avec les IDs
      const ids = this.selectedCompetences.map(c => c.id);
      this.formGroup.patchValue({ competenceIds: ids });
    }
    // Réinitialiser le <select>
    selectElement.value = '';
  }
}

// Vérifie si une compétence est déjà sélectionnée
isCompetenceAlreadySelected(id: number): boolean {
  return this.selectedCompetences.some(c => c.id === id);
}

// Supprimer une compétence
removeCompetence(id: number): void {
  this.selectedCompetences = this.selectedCompetences.filter(c => c.id !== id);
  const ids = this.selectedCompetences.map(c => c.id);
  this.formGroup.patchValue({ competenceIds: ids });
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


closeConfirmModal() {
  this.showConfirmModal = false;
}
setOffreIdForDelete(id: any) {
  this.offreID = id;
  this.showConfirmModal = true;
}


}