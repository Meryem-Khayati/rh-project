import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { NgIf, NgFor } from '@angular/common';
import { NotificationComponent } from '../../../notification/notification.component';
import { Candidat } from '../../../../models/Candidat';
import { CandidatService } from '../../../../services/candidat/candidat.service';
import { CvService } from '../../../../services/cv/cv.service';

@Component({
  selector: 'app-candidats',
  imports: [NgIf, NgFor, NotificationComponent],
  templateUrl: './candidats.component.html',
  styleUrls: ['./candidats.component.css']
})
export class CandidatsComponent implements OnInit {
  candidats: Candidat[] = [];
  loading = true;
  error: string | null = null;

  // Notification
  currentNotification: { title: string; message: string; type: 'success' | 'error' } | null = null;

  constructor(
    private candidatService: CandidatService,
    private cvService: CvService
  ) {}

  ngOnInit(): void {
    this.loadCandidats();
  }

  loadCandidats(): void {
    this.loading = true;
    this.candidatService.getAllCandidats().subscribe({
      next: (data) => {
        this.candidats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger la liste des candidats.';
        this.loading = false;
        console.error(err);
        this.showNotification('Erreur', err.message || 'Échec du chargement.', 'error');
      }
    });
  }

  // === SUPPRESSION ===
  deleteCandidat(id: number, nom: string, prenom: string): void {
    if (!confirm(`⚠️ Supprimer ${prenom} ${nom} ? Cette action est irréversible.`)) return;

    this.candidatService.deleteCandidat(id).subscribe({
      next: (message: string) => {
        this.candidats = this.candidats.filter(c => c.id !== id);
        this.showNotification('Succès', message, 'success');
      },
      error: (err) => {
        this.showNotification('Erreur', err.message || 'Échec de la suppression.', 'error');
      }
    });
  }

  // === CV ===
  downloadCv(candidatId: number): void {
    this.cvService.downloadCV(candidatId).subscribe({
      next: (blob: Blob) => {
        const filename = `cv_${candidatId}.pdf`;
        saveAs(blob, filename);
      },
      error: (err) => {
        this.showNotification('Erreur CV', err.message || 'CV indisponible.', 'error');
      }
    });
  }

  viewCv(candidatId: number): void {
    this.cvService.openCVInNewTab(candidatId);
  }

  // === NOTIFICATION ===
  showNotification(title: string, message: string, type: 'success' | 'error') {
    this.currentNotification = { title, message, type };
    if (type === 'success') {
      setTimeout(() => this.currentNotification = null, 3000);
    }
  }
}