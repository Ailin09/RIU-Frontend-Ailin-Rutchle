import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { HeroFormComponent } from '../../components/hero-form/hero-form.component';
import { Superhero } from '../../models/superhero.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero-form-page',
  standalone: true,
  imports: [HeroFormComponent, MatIconModule],
  template: `
    <div class="hero-form-wrapper">
      <app-hero-form
        [hero]="hero()"
        [isEditMode]="isEditMode()"
        (formSubmit)="onSubmit($event)"
      />
    </div>
  `,
  styleUrl: './hero-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroFormPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private heroService = inject(HeroService);
  hero = signal<Superhero | null>(null);
  isEditMode = signal(false);

  ngOnInit(): void {
    this.heroService.loadHeroes();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (id) {
        this.isEditMode.set(true);
        const heroFound = this.heroService.getHeroById(id);
        if (heroFound) {
          this.hero.set(heroFound);
        }
      } else {
        this.isEditMode.set(false);
        this.hero.set(null);
      }
    });
  }

  onSubmit(data: Superhero): void {
    if (this.isEditMode()) {
      this.heroService.editHero(data);
    } else {
      this.heroService.addHero(data);
    }

    this.router.navigate(['/home']).then(() => {});
  }
}
