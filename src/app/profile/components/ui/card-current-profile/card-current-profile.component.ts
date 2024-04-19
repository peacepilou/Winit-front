import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CurrentUser } from 'src/app/auth/models/current-user.model';

@Component({
  selector: 'app-card-current-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './card-current-profile.component.html',
  styleUrls: ['./card-current-profile.component.scss'],
})
export class CardCurrentProfileComponent {
  @Input() currentUser!: CurrentUser | null;
}
