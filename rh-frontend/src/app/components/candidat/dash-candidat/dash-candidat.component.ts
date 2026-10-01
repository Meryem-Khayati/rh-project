import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../services/auth/login.service';
import { Candidat } from '../../../models/Candidat';
import { NgFor, NgIf } from '@angular/common';
interface SubItem {
  label: string;
  icon: string;
  route: string;
  active: boolean;
  badge: string | null;
}

interface MenuItem {
  icon: string;
  label: string;
  active: boolean;
  badge: string | null;
  submenu: boolean;
  expanded: boolean;
  route: string;
  subItems: SubItem[];
}
interface CandidatInfo {
  id: number;
  prenom: string;
  nom: string;
  username: string;
  role: string;
}
@Component({
  selector: 'app-dash-candidat',
  imports: [NgFor, NgIf, RouterOutlet],
  templateUrl: './dash-candidat.component.html',
  styleUrl: './dash-candidat.component.css'
})
export class DashCandidatComponent implements OnInit, OnDestroy{
  sidebarCollapsed = false;
  userMenuOpen = false;
  candidatInfo: CandidatInfo | null = null;
  loading = true;
  private subscriptions = new Subscription();

  menuItems: MenuItem[] = [
  {
    icon: 'grid',
    label: 'Dashboard',
    active: true,
    badge: null,
    submenu: false,
    expanded: false,
    route: '/dash-candidat/main-candidat',
    subItems: []
  },
 
  {
    icon: 'briefcase',
    label: 'Mon Profil',
    active: false,
    badge: null,
    submenu: false,
    expanded: false,
    route: '/dash-candidat/profil',
    subItems: []
  },
  {
    icon: 'clipboard-check',
    label: 'Mes Candidatures',
    active: false,
    badge: null,
    submenu: false,
    expanded: false,
    route: '/dash-candidat/suivi',
    subItems: []
  },
  {
    icon: 'grid',
    label: 'Offres d\'emploi',
    active: false,
    badge: null,
    submenu: false,
    expanded: false,
    route: '/offres',
    subItems: []
  },
  
];


  monthlyData = [
    { month: 'Jan', value: 150 },
    { month: 'Feb', value: 400 },
    { month: 'Mar', value: 200 },
    { month: 'Apr', value: 320 },
    { month: 'May', value: 180 },
    { month: 'Jun', value: 200 },
    { month: 'Jul', value: 320 },
    { month: 'Aug', value: 100 },
    { month: 'Sep', value: 220 },
    { month: 'Oct', value: 380 },
    { month: 'Nov', value: 280 },
    { month: 'Dec', value: 120 }
  ];

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loadAdminInfo();
  }

  /**
   * Charger les informations de l'admin depuis le service
   */
  loadAdminInfo(): void {
    // Essayer d'abord de récupérer depuis le signal du service
    const currentUser = this.loginService.user();
    
    if (currentUser) {
      this.candidatInfo = {
        id: currentUser.id,
        prenom: currentUser.prenom,
        nom: currentUser.nom,
        username: currentUser.username,
        role: currentUser.role
      };
      this.loading = false;
    } else {
      // Si pas dans le signal, récupérer depuis le backend
      this.subscriptions.add(
        this.loginService.getUser().subscribe({
          next: (user) => {
            if (user) {
              this.candidatInfo = {
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                username: user.username,
                role: user.role
              };
            }
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des infos de candidats:', err);
            this.loading = false;
            // Rediriger vers login si erreur
            this.router.navigate(['/login']);
          }
        })
      );
    }
  }

  /**
   * Obtenir le nom complet de l'admin
   */
  getFullName(): string {
    if (!this.candidatInfo) return 'Chargement...';
    return `${this.candidatInfo.prenom} ${this.candidatInfo.nom}`;
  }

  /**
   * Obtenir les initiales pour l'avatar
   */
  getInitials(): string {
    if (!this.candidatInfo) return 'AD';
    const firstInitial = this.candidatInfo.prenom?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.candidatInfo.nom?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'AD';
  }

  /**
   * Déconnexion de l'admin
   */
  logout(): void {
    // Fermer le menu utilisateur
    this.userMenuOpen = false;

    // Appeler le service de déconnexion
    this.subscriptions.add(
      this.loginService.logout().subscribe({
        next: () => {
          // Rediriger vers la page de connexion
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erreur lors de la déconnexion:', err);
          // Même en cas d'erreur, rediriger vers login
          this.router.navigate(['/login']);
        }
      })
    );
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }

  navigateTo(item: MenuItem | SubItem): void {
    // Désactiver tous les menus
    this.menuItems.forEach(menuItem => {
      menuItem.active = false;
      if (menuItem.subItems) {
        menuItem.subItems.forEach(subItem => subItem.active = false);
      }
    });

    // Activer l'item sélectionné
    item.active = true;

    // Naviguer vers la route
    console.log('Navigation vers:', item.route);
    this.router.navigate([item.route]);
  }

  getBarHeight(value: number): string {
    const maxValue = Math.max(...this.monthlyData.map(d => d.value));
    return `${(value / maxValue) * 100}%`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
