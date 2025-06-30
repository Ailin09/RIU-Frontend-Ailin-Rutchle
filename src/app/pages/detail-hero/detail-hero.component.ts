import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroDetailComponent } from '../../components/hero-detail/hero-detail.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-hero',
  standalone: true,
  imports: [HeroDetailComponent],
  template: ` <section class="hero-detail-page">
      <app-hero-detail [heroId]="heroId" />
    </section>`,
  styleUrl: './detail-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailHeroComponent { 
    heroId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
}
