import { Component, input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Superhero } from '../../models/superhero.interface';
import { RouterModule } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./hero-carousel.component.scss'],
  template: `
<swiper-container
  effect="coverflow"
  grab-cursor="true"
  centered-slides="true"
  centered-slides-bounds="true"
  [slides-per-view]="getSlidesPerView()"
  coverflow-effect='{
    "rotate": 18,
    "stretch": 0,
    "depth": 90,
    "modifier": 1.18,
    "scale": 0.98,
    "slideShadows": true
  }'
  [initial-slide]="getInitialSlide()"
  [breakpoints]="breakpoints"
  loop="true"
  autoplay='{"delay":2400,"pauseOnMouseEnter":true}'
  class="custom-swiper"
>
  <h2 class="carousel-title">{{ title() }}</h2>
  @for (hero of heroes(); track hero.id) {
    <swiper-slide>
      <div class="hero-card">
        <img class="hero-img" [src]="hero.images.lg" [alt]="hero.name" />
        <div class="card-info">
          <h3>{{ hero.name }}</h3>
          <div class="power-row">
            <span class="stat-label">Inteligencia</span>
            <span class="stat-value">{{ hero.powerstats.intelligence }}</span>
          </div>
          <div class="power-row">
            <span class="stat-label">Fuerza</span>
            <span class="stat-value">{{ hero.powerstats.strength }}</span>
          </div>
        </div>
      </div>
    </swiper-slide>
  }
</swiper-container>
`
})
export class HeroCarouselComponent {
  heroes = input<Superhero[]>(); 
  title = input<string>('');

  getSlidesPerView(): number {
    const w = window.innerWidth;
    const count = this.heroes()?.length ?? 1;
    if (w < 600) return 1;
    if (w < 900) return Math.min(3, count);
    return Math.min(5, count);
  }

  breakpoints = {
    0: { slidesPerView: 1 },
    600: { slidesPerView: 3 },
    900: { slidesPerView: 5 }
  };

  getInitialSlide(): number {
    const arr = this.heroes();
    return arr?.length ? Math.floor(arr.length / 2) : 0;
  }
}
