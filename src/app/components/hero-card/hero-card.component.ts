import { Component, input } from '@angular/core';
import { Superhero } from '../../models/superhero.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
<mat-card class="hero-card-spotlight">
  <div class="hero-img-spotlight">
    <img mat-card-image [src]="hero()!.images.lg" [alt]="hero()!.name" />
    <div class="bottom-gradient">
      <span class="card-name">{{ hero()!.name }}</span>
    </div>
  </div>
</mat-card>


  `,
  styleUrls: ['./hero-card.component.scss'],
})
export class HeroCardComponent {
  hero = input<Superhero>();
}
