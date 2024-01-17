import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTournamentMatchComponent } from '../card-tournament-match/card-tournament-match.component';
import { TournamentDetails } from 'src/app/tournament/models/tournament-details.model';

@Component({
  selector: 'app-list-tournament-tree',
  standalone: true,
  imports: [CommonModule, CardTournamentMatchComponent],
  templateUrl: './list-tournament-tree.component.html',
  styleUrls: ['./list-tournament-tree.component.scss'],
})
export class ListTournamentTreeComponent {
  @Input() tournamentDetails!: TournamentDetails;
  ngOnInit(): void {
    console.log(this.tournamentDetails);
  }
}
