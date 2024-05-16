import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TournamentDetails } from 'src/app/tournament/models/tournament-details.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import * as fr from '@angular/common/locales/fr';
import { GetImageService } from 'src/app/shared/get-image.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TournamentService } from 'src/app/tournament/shared/tournament.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TimeService } from 'src/app/tournament/shared/time-service.service';
import { getRemainingTime } from 'src/app/tournament/shared/utils/convertTime.util';
import { ModalContent } from 'src/app/components/models/modal-content.model';
import { ModalComponent } from 'src/app/components/ui/modal/modal.component';
@Component({
  selector: 'app-card-details-tournament',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './card-details-tournament.component.html',
  styleUrls: ['./card-details-tournament.component.scss'],
})
export class CardDetailsTournamentComponent implements OnInit {
  @Input() tournament$!: Observable<TournamentDetails>;
  public image: any;
  public tournamentDate!: Date;
  public currentDate: Date = new Date();
  public remainingTime = '';
  public tournamentId!: number;
  public currentNumberOfParticipants!: number;
  public maxNumberOfTeams!: number;
  public teamInscriptionSubscription!: Subscription;
  currentUser!: boolean;

  constructor(
    private getImageService: GetImageService,
    private route: ActivatedRoute,
    private timeService: TimeService,
    private tournamentService: TournamentService,
    private dialog: MatDialog
  ) {
    registerLocaleData(fr.default);
  }

  ngOnInit() {
    if (this.route.params) {
      this.route.params.subscribe(params => {
        this.tournamentId = Number(params['id']);
      });
    }

    this.updateCurrentDate();

    if (this.tournament$) {
      this.tournament$.subscribe(tournament => {
        this.maxNumberOfTeams = tournament.maxNumberOfTeams;
        this.currentNumberOfParticipants =
          tournament.currentNumberOfParticipants ?? 0;
        this.getImageService.getImage(tournament.imageUrl).subscribe(data => {
          this.image = data;
          this.currentUser = tournament.isOwner;
          this.tournamentDate = new Date(tournament.inscriptionLimitDate);
          this.remainingTime = getRemainingTime(
            this.tournamentDate,
            this.timeService,
            this.currentDate
          );
        });
      });
    }

    this.teamInscriptionSubscription =
      this.tournamentService.inscription$.subscribe(result => {
        if (result === true) {
          this.currentNumberOfParticipants++;
        } else if (result === false) {
          this.currentNumberOfParticipants--;
        }
      });
  }

  private updateCurrentDate() {
    setTimeout(() => {
      this.currentDate = new Date();
      this.updateCurrentDate();
    }, 60000);
  }

  openDialog(tournamentDetails: TournamentDetails) {
    const modalData: ModalContent = {
      title: 'Confirmation',
      content: `Êtes-vous sûr de vouloir confirmer la suppression de ce tournoi?`,
    };

    const dialogRef = this.dialog.open(ModalComponent, {
      data: new ModalContent(modalData),
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        this.tournamentService.deleteTournament(tournamentDetails);
      }
    });
  }
}
