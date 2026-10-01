import { Routes } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { DashboardComponent } from './components/recruteur/dashboard/dashboard.component';
import { LoginComponent } from './components/public/login/login.component';
import { InscriptionComponent } from './components/public/inscription/inscription.component';
import { RegisterCandidatComponent } from './components/public/register-candidat/register-candidat.component';
import { RegisterRecruteurComponent } from './components/public/register-recruteur/register-recruteur.component';
import { DashAdminComponent } from './components/admin/dash-admin/dash-admin.component';
import { CandidatsComponent } from './components/admin/candidats/candidats/candidats.component';
import { RecruteursComponent } from './components/admin/recruteurs/recruteurs.component';
import { DashCandidatComponent } from './components/candidat/dash-candidat/dash-candidat.component';
import { ProfilComponent } from './components/candidat/profil/profil.component';
import { SuiviComponent } from './components/candidat/suivi/suivi.component';
import { MainComponenet } from './components/admin/main/main.component';
import { MainCandidatComponent } from './components/candidat/main-candidat/main-candidat.component';
import { authGuard } from './core/guards/auth.guard';
import { DashRecruteurComponent } from './components/recruteurs/dash-recruteur/dash-recruteur.component';
import { CompetenceComponent } from './components/recruteurs/competence/competence.component';
import { OffreemploiComponent } from './components/recruteurs/offres/offreemploi.component';
import { OffresComponent } from './components/recruteurs/candidature/offres/offres.component';
import { CandidatureComponent } from './components/recruteurs/candidature/candidature/candidature.component';
import { EntretienComponent } from './components/recruteurs/candidature/entretien/entretien.component';
import { OffredetailsComponent } from './components/public/offres/offredetails.component';
import { MainRecruteurComponent } from './components/recruteurs/main-recruteur/main-recruteur.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'inscription-candidat', component: RegisterCandidatComponent },
  { path: 'inscription-recruteur', component: RegisterRecruteurComponent },
  { path: 'offres', component: OffredetailsComponent },
    {
      path: 'dash-recruteur',
      component: DashRecruteurComponent,
      canActivate: [authGuard],
      data: { roles: ['RECRUTEUR'] },
      children: [
        { path: '', redirectTo: 'main-recruteur', pathMatch: 'full' },
        { path: 'main-recruteur', component: MainRecruteurComponent },
        { path: 'competences', component: CompetenceComponent },
        { path: 'offres', component: OffreemploiComponent },
        { path: 'offresemploi', component: OffresComponent },
        { path: 'offresemploi/:id/candidatures', component: CandidatureComponent },
        { path: 'candidatures/:id/entretiens', component: EntretienComponent },
      ]
    },


  // Routes protégées — Candidats
  {
    path: 'dash-candidat',
    component: DashCandidatComponent,
    canActivate: [authGuard],
    data: { roles: ['CANDIDAT'] },
    children: [
      { path: '', redirectTo: 'main-candidat', pathMatch: 'full' },
      { path: 'main-candidat', component: MainCandidatComponent },
      { path: 'suivi', component: SuiviComponent },
      { path: 'profil', component: ProfilComponent }
    ]
  },


  // Routes protégées — Admin
  {
    path: 'dash-admin',
    component: DashAdminComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponenet },
      { path: 'candidats', component: CandidatsComponent },
      { path: 'recruteurs', component: RecruteursComponent }
    ]
  },
  


  
];