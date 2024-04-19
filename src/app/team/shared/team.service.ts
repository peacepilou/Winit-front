import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team.model';
import { Observable, Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/toast.service';
import { CreatedTeam } from '../models/created-team.model';
import { ITeamService } from './interfaces/ITeam.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService implements ITeamService {
  constructor(
    public http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {}

  getAllTeamsByUser(): Observable<Team[]> {
    return this.http.get<Team[]>(`${environment.urlApi}/teams`);
  }

  getTeamByTeamName(teamName: string): Observable<Team> {
    return this.http.get<Team>(`${environment.urlApi}/teams/${teamName}`);
  }

  addTeam(team: CreatedTeam): void {
    this.http.post<CreatedTeam>(`${environment.urlApi}/teams`, team).subscribe(
      (response) => {
        if (response) {
          this.router.navigate([`/teams-details/${team.name}`]);
          this.toastService.showSuccess(
            'Bravo félicitations',
            'Création de votre équipe'
          );
        }
      },
      (error) => {
        if (error.error === "Le nom de l'équipe est déjà pris") {
          this.toastService.showError(error.error, 'Une erreur est survenue');
        }
      }
    );
  }

  deleteTeam(teamName: string): void {
    this.http.delete<any>(`${environment.urlApi}/teams/${teamName}`).subscribe(
      (response) => {
        if (response) {
          this.toastService.showSuccess(
            'Suppression',
            "L'équipe supprimé avec succès"
          );
          this.router.navigate(['/profile']);
        }
      },
      (error) => {
        if (error.error) {
          this.toastService.showError(
            error.error,
            "Une erreur est survenue lors de la suppression de l'équipe"
          );
        }
      }
    );
  }
}
