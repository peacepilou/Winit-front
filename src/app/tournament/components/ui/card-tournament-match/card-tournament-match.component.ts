import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScoreModalComponent } from '../../feature/score-modal/score-modal.component';
import { ScoreModalContent } from 'src/app/tournament/models/ScoreModal.model';
import { TournamentDetails } from 'src/app/tournament/models/tournament-details.model';

@Component({
  selector: 'app-card-tournament-match',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './card-tournament-match.component.html',
  styleUrls: ['./card-tournament-match.component.scss'],
})
export class CardTournamentMatchComponent {
  @Input() tournamentDetails!: TournamentDetails;
  @Input() match: any;
  @Input() matchesByPhase: any;
  @Input() phaseKey: string = '';
  @Input() isCompleted!: boolean;
  @Input() indexPhasesOther: any;
  @Input() indexPhasePreliminary: any;
  @Input() isLastIteration: boolean = false;
  @Input() namesTeamList: any;
  nextPhase!: string | null;
  margin: number = 0;
  isEven: string = '';
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.findNextPhase(this.phaseKey, this.matchesByPhase);

    this.marginCalculator(this.indexPhasesOther, this.indexPhasePreliminary);

    if (this.namesTeamList.isEven === true) {
      this.isEven = 'even';
    } else {
      this.isEven = 'odd';
    }
  }

  truncateName(text: string): string {
    return text.length > 10 ? text.substring(0, 10) + '...' : text;
  }

  findNextPhase(phaseKey: string, matchesByPhase: any): string | null {
    if (phaseKey && matchesByPhase) {
      let maxMatchCount = 0;

      if (
        phaseKey === 'Phase préliminaire' &&
        Object.keys(matchesByPhase).length > 1
      ) {
        for (const phase in matchesByPhase) {
          if (
            Object.prototype.hasOwnProperty.call(matchesByPhase, phase) &&
            phase !== 'Phase préliminaire'
          ) {
            const matchCount = matchesByPhase[phase].length;
            if (matchCount > maxMatchCount) {
              maxMatchCount = matchCount;
              this.nextPhase = phase;
            }
          }
        }

        return this.nextPhase;
      } else {
        const currentPhaseMatchCount = matchesByPhase[phaseKey]?.length || 0;

        const filteredPhases = Object.keys(matchesByPhase).filter(
          (phase) => phase !== phaseKey && phase !== 'Phase préliminaire'
        );

        for (const phase of filteredPhases) {
          const matchCount = matchesByPhase[phase].length;

          if (matchCount === currentPhaseMatchCount / 2) {
            this.nextPhase = phase;
          }
        }

        return this.nextPhase;
      }
    }
    return null;
  }

  findMatchWithStatus(
    phase: string,
    matchesByPhase: any
  ): { id: number; team: string } | null {
    if (phase && matchesByPhase) {
      const matches = matchesByPhase[phase];

      const matchWithStatus = matches.find(
        (match: any) =>
          match.team1 === 'En attente' || match.team2 === 'En attente'
      );

      if (matchWithStatus) {
        const team =
          matchWithStatus.team1 === 'En attente'
            ? matchWithStatus.team1
            : matchWithStatus.team2;

        return {
          id: matchWithStatus.id,
          team: team === matchWithStatus.team1 ? 'team1' : 'team2',
        };
      }
    }
    return null;
  }

  openDialog() {
    if (this.nextPhase) {
      const nextTeamInfo = this.findMatchWithStatus(
        this.nextPhase,
        this.matchesByPhase
      );

      if (this.nextPhase) {
        const modalData: ScoreModalContent = {
          match: this.match,
          nextPhase: this.nextPhase,
          nextTeamInfo: nextTeamInfo,
          tournamentId: this.tournamentDetails.id,
        };

        this.dialog.open(ScoreModalComponent, {
          data: new ScoreModalContent(modalData),
        });
      }
    } else {
      const modalData: ScoreModalContent = {
        match: this.match,
        tournamentId: this.tournamentDetails.id,
        nextPhase: 'Aucune',
        nextTeamInfo: {},
      };

      this.dialog.open(ScoreModalComponent, {
        data: new ScoreModalContent(modalData),
      });
    }
  }

  marginCalculator(indexPhasesOther: number, indexPhasePreliminary: number) {
    if (indexPhasesOther === 0) {
      this.margin = 2 ** (indexPhasesOther + 2.6) - 2;
    } else if (indexPhasesOther > 0) {
      this.margin = 2 ** (indexPhasesOther + 3) - 2;
    } else if (indexPhasePreliminary) {
      this.margin = 2;
    }
  }
}
