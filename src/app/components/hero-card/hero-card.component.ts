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
  template: `
    <mat-card class="hero-card-spotlight">
      <div class="hero-img-spotlight">
        <img mat-card-image [src]="hero()!.images.lg" [alt]="hero()!.name" />
        <div class="bottom-gradient"></div>
      </div>
      <div class="card-footer">
        <button
          mat-raised-button
          class="view-more-overlay"
          (click)="goToDetail()!(hero()!.id)"
        >
          Ver más
        </button>
      </div>

      <div class="card-buttons">
        <button
          mat-icon-button
          color="primary"
          (click)="onEdit()!(hero()!.id)"
          matTooltip="Editar"
        >
          <mat-icon>edit</mat-icon>
        </button>

        <button
          mat-icon-button
          color="warn"
          (click)="onDelete()!(hero()!.id)"
          matTooltip="Eliminar"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </mat-card>
  `,
  styleUrls: ['./hero-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCardComponent {
  hero = input<Superhero>();
  onEdit = input<(id: number) => void>();
  onDelete = input<(id: number) => void>();
  goToDetail = input<(id: number) => void>();
}
