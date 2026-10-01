import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Country {
  name: string;
  icon: 'globe' | 'ma' | 'tn' | 'dz';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;
  countryOpen = false;

  selectedCountry: Country = { name: 'International', icon: 'globe' };
  countries: Country[] = [
    { name: 'International', icon: 'globe' },
    { name: 'Maroc', icon: 'ma' },
    { name: 'Tunisie', icon: 'tn' },
    { name: 'Algérie', icon: 'dz' }
  ];

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleCountry() {
    this.countryOpen = !this.countryOpen;
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.countryOpen = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}