import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TeamService } from '../team.service';
import { inject } from '@angular/core';
import { TeamDetails } from '../../models/team-details.model';

export const memberResolver: ResolveFn<
  TeamDetails | null
> = (): Observable<TeamDetails | null> => {
  const teamName: string | null = inject(TeamService).getSelectedNameTeam();

  if (teamName) {
    return inject(TeamService).getAllMembersByTeam(teamName);
  } else {
    return of(null);
  }
};
