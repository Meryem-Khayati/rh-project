export class User {
  id!: number;
  username: string = '';
  prenom: string = '';
  nom: string = '';
  role: string = '';
  password: string = '';

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Obtenir le nom complet
   */
  getFullName(): string {
    return `${this.prenom} ${this.nom}`;
  }

  /**
   * Obtenir les initiales
   */
  getInitials(): string {
    const firstInitial = this.prenom?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.nom?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  /**
   * Vérifier si l'utilisateur est un admin
   */
  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  /**
   * Vérifier si l'utilisateur est un recruteur
   */
  isRecruteur(): boolean {
    return this.role === 'RECRUTEUR';
  }

  /**
   * Vérifier si l'utilisateur est un candidat
   */
  isCandidat(): boolean {
    return this.role === 'CANDIDAT';
  }

  
}
