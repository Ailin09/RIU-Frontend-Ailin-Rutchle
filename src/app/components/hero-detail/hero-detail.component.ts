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
  template: `
    @if (loader.loading()) {
    <app-loader></app-loader>
    } @else if (hero()) { @if (loader.loading()) {
    <app-loader></app-loader>
    } @else if (hero()) {
    <button class="neon-watch-blue" (click)="goBack()">
      <mat-icon>arrow_back</mat-icon>
      Volver
    </button>
    <main class="hero-detail-container">
      <h2 class="section-title neon-title">{{ hero()?.name }}</h2>

      <section class="hero-content-wrapper">
        <div class="hero-image">
          <img [src]="hero()?.images?.lg" [alt]="hero()?.name" />
        </div>
        <div class="hero-data">
          <mat-card class="hero-section">
            <h3 class="subsection-title neon-title">Estadísticas de poder</h3>
            <ul class="hero-ul">
              <li>
                <strong>Inteligencia:</strong>
                {{ hero()?.powerstats?.intelligence }}
              </li>
              <li>
                <strong>Fuerza:</strong> {{ hero()?.powerstats?.strength }}
              </li>
              <li>
                <strong>Velocidad:</strong> {{ hero()?.powerstats?.speed }}
              </li>
              <li>
                <strong>Durabilidad:</strong>
                {{ hero()?.powerstats?.durability }}
              </li>
              <li><strong>Poder:</strong> {{ hero()?.powerstats?.power }}</li>
              <li>
                <strong>Combate:</strong> {{ hero()?.powerstats?.combat }}
              </li>
            </ul>
          </mat-card>

          <mat-card class="hero-section">
            <h3 class="subsection-title neon-title">Apariencia</h3>
            <ul class="hero-ul">
              <li><strong>Género:</strong> {{ hero()?.appearance?.gender }}</li>
              <li><strong>Raza:</strong> {{ hero()?.appearance?.race }}</li>
              <li>
                <strong>Color de ojos:</strong>
                {{ hero()?.appearance?.eyeColor }}
              </li>
              <li>
                <strong>Color de cabello:</strong>
                {{ hero()?.appearance?.hairColor }}
              </li>
            </ul>
          </mat-card>

          <mat-card class="hero-section">
            <h3 class="subsection-title neon-title">Biografía</h3>
            <ul class="hero-ul">
              <li>
                <strong>Alter egos:</strong> {{ hero()?.biography?.alterEgos }}
              </li>
              <li>
                <strong>Alias:</strong>
                {{ hero()?.biography?.aliases?.join(', ') }}
              </li>
              <li>
                <strong>Lugar de nacimiento:</strong>
                {{ hero()?.biography?.placeOfBirth }}
              </li>
              <li>
                <strong>Primera aparición:</strong>
                {{ hero()?.biography?.firstAppearance }}
              </li>
              <li>
                <strong>Editorial:</strong> {{ hero()?.biography?.publisher }}
              </li>
              <li>
                <strong>Alineación:</strong> {{ hero()?.biography?.alignment }}
              </li>
            </ul>
          </mat-card>

          <mat-card class="hero-section">
            <h3 class="subsection-title neon-title">Trabajo</h3>
            <ul class="hero-ul">
              <li>
                <strong>Ocupación:</strong> {{ hero()?.work?.occupation }}
              </li>
              <li><strong>Base:</strong> {{ hero()?.work?.base }}</li>
            </ul>
          </mat-card>

          <mat-card class="hero-section">
            <h3 class="subsection-title neon-title">Conexiones</h3>
            <ul class="hero-ul">
              <li>
                <strong>Afiliaciones:</strong>
                {{ hero()?.connections?.groupAffiliation }}
              </li>
              <li>
                <strong>Familiares:</strong>
                {{ hero()?.connections?.relatives }}
              </li>
            </ul>
          </mat-card>
        </div>
      </section>
    </main>

    } }
  `,
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
