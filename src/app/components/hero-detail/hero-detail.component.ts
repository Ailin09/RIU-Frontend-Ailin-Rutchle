import { Component, inject, input, signal, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { Superhero } from '../../models/superhero.interface';
import { LoaderService } from '../../services/loader.service';
import { AppLoaderComponent } from '../../shared/app-loader/app-loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [AppLoaderComponent, MatIconModule, MatCardModule],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit {
  private heroService = inject(HeroService);
  loader = inject(LoaderService);
  readonly heroId = input<number>();
  readonly hero = signal<Superhero | null>(null);

  ngOnInit(): void {
    this.loader.show();
    setTimeout(() => {
      const id = this.heroId();
      if (id !== undefined) {
        const result = this.heroService.getHeroById(id);
        this.hero.set(result);
      }
      this.loader.hide();
    }, 600);
  }
  goBack(): void {
    history.back();
  }
}
