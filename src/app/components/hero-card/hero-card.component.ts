import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { Superhero } from '../../models/superhero.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCardComponent {
  hero = input<Superhero>();
  onEdit = input<(id: number) => void>();
  onDelete = input<(id: number) => void>();
  goToDetail = input<(id: number) => void>();
}
