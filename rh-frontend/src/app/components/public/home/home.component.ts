import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
interface Country {
  name: string;
  icon: 'globe' | 'ma' | 'tn' | 'dz';
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  menuOpen = false;
  countryOpen = false;
  constructor( private router: Router,){
  }
 

  countries: Country[] = [
    { name: 'International', icon: 'globe' },
    { name: 'Maroc', icon: 'ma' },
    { name: 'Tunisie', icon: 'tn' },
    { name: 'Algérie', icon: 'dz' }
  ];

  selectedCountry: Country = this.countries[0];



  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleCountry() {
    this.countryOpen = !this.countryOpen;
  }

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.countryOpen = false;
  }
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

