import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
declare var lottie: any;

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'] // ou styles: []
})
export class InscriptionComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadLottieAnimations();
  }

  loadLottieAnimations() {
    // Animation pour les candidats
    lottie.loadAnimation({
      container: document.getElementById('candidat-animation')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/candidat.json' // ✅ Chemin local
    });

    // Animation pour les recruteurs
    lottie.loadAnimation({
      container: document.getElementById('recruteur-animation')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/recruteur.json' // ✅ Chemin local
    });
  }

  navigateToCandidat() {
    this.router.navigate(['/inscription-candidat']);
  }

  navigateToRecruteur() {
    this.router.navigate(['/inscription-recruteur']);
  }
}