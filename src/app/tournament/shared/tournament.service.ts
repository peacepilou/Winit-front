import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TournamentCreationDto } from '../models/tournament-creation-dto.model';
import { TournamentDetails } from '../models/tournament-details.model';
import { Tournament } from '../models/tournament.model';
import { ToastService } from 'src/app/shared/toast.service';
import { TournamentMappers } from './mappers/TournamentMappers';
import { TournamentCard } from '../models/tournament-card.model';
import { ITournamentService } from './interfaces/ITournament.service';
import { ChosenTeam } from '../models/chosenTeam.model';

@Injectable({
  providedIn: 'root',
})
export class TournamentService implements ITournamentService {
  private tournamentDataUrl = `${environment.urlApi}/tournaments/`;
  private apiUrl = `${environment.urlApi}` + '/tournaments/create';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private tournamentMappers: TournamentMappers
  ) {}

  getAllTournaments(): Observable<TournamentCard[]> {
    return this.http.get<any>(this.tournamentDataUrl);
  }

  createTournament(newTournament: TournamentCreationDto): void {
    const tournamentCreationDto =
      this.tournamentMappers.ToFormData(newTournament);

    const headers = new HttpHeaders();
    headers.append('Content-type', 'multipart/form-data');

    this.http
      .post<Tournament>(this.apiUrl, tournamentCreationDto, { headers })
      .subscribe(
        (response) => {
          console.warn('Response: ', response);
          if (response) {
            console.log('success');
            this.router.navigate(['/tournament/' + response]);
            this.toastService.showSuccess(
              'Votre tournoi est prêt !',
              'Tournoi créé avec succès'
            );
          }
        },
        (error) => {
          console.error('Error: ', error);
          const errorMessage =
            error?.error?.error_message || 'Une erreur est survenue';
          this.toastService.showError(
            errorMessage,
            'Erreur lors de la création du tournoi'
          );
          return throwError(() => new Error(error));
        }
      );
  }

  getTournamentById(id: number): Observable<TournamentDetails> {
    return this.http.get<TournamentDetails>(this.tournamentDataUrl + id);
  }

  addTeamToTournament(chosenTeam: ChosenTeam): void {
    console.log(chosenTeam);

    this.http
      .post<ChosenTeam>(`${environment.urlApi}/tournament/teams`, chosenTeam)
      .subscribe(
        (response) => {
          if (response) {
            this.toastService.showSuccess(
              'Bravo félicitations',
              "L'ajout de votre équipe au tournoi a bien été prise en compte"
            );
          }
        },
        (error) => {
          if (error.error) {
            this.toastService.showError(
              error.error,
              "Une erreur est survenue lors de l'enregistrement"
            );
          }
        }
      );
  }
}
