import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  // private tournamentDataUrl = '../model/tournament-list.model.ts';
  // constructor(private http: HttpClient) {}
  // getAllTournaments(): Observable<Tournament[]> {
  //   return this.http.get<Tournament[]>(this.tournamentDataUrl);
  // }
}
