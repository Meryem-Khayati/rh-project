import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/auth/login.service';
import { Subscription } from 'rxjs';

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

interface UserInfo {
  id: number;
  prenom: string;
  nom: string;
  username: string;
  role: string;
}



@Component({
  selector: 'app-dash-recruteur',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dash-recruteur.component.html',
  styleUrl: './dash-recruteur.component.css'
})
export class DashRecruteurComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  userMenuOpen = false;
  userInfo: UserInfo | null = null;
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
      route: '/dash-recruteur',
      subItems: []
    },
  
    {
      icon: 'award',
      label: 'Competences',
      active: false,
      badge: null,
      submenu: true,
      expanded: false,
      route: '',
      subItems: [
        {
          label: 'competences',
          icon: 'list',
          route: '/dash-recruteur/competences',
          active: false,
          badge: null
        }
      ]
    },
    {
      icon: 'briefcase',
      label: 'Offres d’emploi',
      active: false,
      badge: null,
      submenu: true,
      expanded: false,
      route: '',
      subItems: [
        {
          label: 'Mes offres',
          icon: 'list',
          route: '/dash-recruteur/offres',
          active: false,
          badge: null
        }
      ]
    },
  
    {
      icon: 'users',
      label: 'Candidatures',
      active: false,
      badge: null,
      submenu: true,
      expanded: false,
      route: '',
      subItems: [
        {
          label: 'Toutes les candidatures',
          icon: 'list',
          route: '/dash-recruteur/offresemploi',
          active: false,
          badge: null
        }
      ]
    }
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
    this.loadRecruteurInfo();
  }

  /**
   * Charger les informations de l'admin depuis le service
   */
  loadRecruteurInfo(): void {
    // Essayer d'abord de récupérer depuis le signal du service
    const currentUser = this.loginService.user();
    
    if (currentUser) {
      this.userInfo = {
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
              this.userInfo = {
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
            console.error('Erreur lors du chargement des infos admin:', err);
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
    if (!this.userInfo) return 'Chargement...';
    return `${this.userInfo.prenom} ${this.userInfo.nom}`;
  }

  /**
   * Obtenir les initiales pour l'avatar
   */
  getInitials(): string {
    if (!this.userInfo) return 'AD';
    const firstInitial = this.userInfo.prenom?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.userInfo.nom?.charAt(0)?.toUpperCase() || '';
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