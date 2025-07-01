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
  templateUrl: './hero-carousel.component.html',
})
export class HeroCarouselComponent {
  heroes = input.required<Superhero[]>();
  title = input<string>('Últimos héroes agregados');

  getSlidesPerView(): number {
    const w = window.innerWidth;
    const count = this.heroes().length;
    if (w < 600) return 1;
    if (w < 900) return Math.min(3, count);
    return Math.min(5, count);
  }

  breakpoints = {
    0: { slidesPerView: 1 },
    600: { slidesPerView: 3 },
    900: { slidesPerView: 5 },
  };

  getInitialSlide(): number {
    const arr = this.heroes();
    return arr?.length ? Math.floor(arr.length / 2) : 0;
  }
 isNewHero(hero: Superhero): boolean {
  if (!hero.createdAt) return false;
  return Date.now() - new Date(hero.createdAt).getTime() < 86400000;
}

}
