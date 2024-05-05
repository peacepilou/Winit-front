import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ScoreModalComponent } from '../../feature/score-modal/score-modal.component';
import { ScoreModalContent } from 'src/app/tournament/models/ScoreModal.model';

@Component({
  selector: 'app-card-tournament-match',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './card-tournament-match.component.html',
  styleUrls: ['./card-tournament-match.component.scss'],
})
export class CardTournamentMatchComponent {
  @Input() match: any;
  @Input() matchesByPhase: any;
  @Input() phaseKey: string = '';
  @Input() isCompleted!: boolean;
  nextPhase!: string | null;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.findNextPhase(this.phaseKey, this.matchesByPhase);
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
    console.log(this.nextPhase);

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
        };

        const dialogRef = this.dialog.open(ScoreModalComponent, {
          data: new ScoreModalContent(modalData),
        });
        dialogRef.afterClosed().subscribe((response) => {
          if (response === true) {
          }
        });
      }
    } else {
      const modalData: ScoreModalContent = {
        match: this.match,
        nextPhase: 'Aucune',
        nextTeamInfo: {},
      };

      const dialogRef = this.dialog.open(ScoreModalComponent, {
        data: new ScoreModalContent(modalData),
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response === true) {
        }
      });
    }
  }
}
