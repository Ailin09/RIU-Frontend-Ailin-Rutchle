import { Component, inject, computed, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeroService } from '../../services/hero.service';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatPaginatorModule,
    MatIcon,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    HeroCarouselComponent,
    HeroCardComponent,
  ],
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
<mat-toolbar class="neon-header">
  <img src="assets/logo.svg" class="main-logo" alt="Logo" />
  <span class="header-spacer"></span>
  <button class="neon-watch-blue">
    <mat-icon class="icon">add</mat-icon>
    Agregar Héroe
  </button>
</mat-toolbar>

<main>
  <!-- Carrusel -->
  @if (latestHeroes().length) {
    <section class="custom-carousel-bg">
      <h4 class="neon-title custom-title">Últimos agregados</h4>
      <app-hero-carousel [heroes]="latestHeroes()" />
    </section>
  }

  <!-- Listado con filtros -->
  <section class="custom-cardlist-bg card-neon">
    <h4 class="neon-title">Todos los héroes</h4>

    <div class="hero-card-list">
      <mat-form-field appearance="outline" class="neon-form">
        <mat-label>Editorial</mat-label>
        <mat-select [formControl]="publisherControl">
          <mat-option value="all">Todos</mat-option>
          <mat-option value="marvel">Marvel</mat-option>
          <mat-option value="dc">DC</mat-option>
          <mat-option value="bad">Villanos</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="neon-form">
        <mat-label>Género</mat-label>
        <mat-select [formControl]="genderControl">
          <mat-option value="">Todos</mat-option>
          @for (g of genders(); track g) {
            <mat-option [value]="g">{{ g }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="neon-form">
        <mat-label>Raza</mat-label>
        <mat-select [formControl]="raceControl">
          <mat-option value="">Todas</mat-option>
          @for (r of races(); track r) {
            <mat-option [value]="r">{{ r }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="neon-form">
        <mat-label>Orden</mat-label>
        <mat-select [formControl]="orderControl">
          <mat-option value="recent">Más recientes</mat-option>
          <mat-option value="az">A-Z</mat-option>
          <mat-option value="za">Z-A</mat-option>
        </mat-select>
      </mat-form-field>

      <button class="neon-outline icon-left" (click)="resetFilters()">
        <mat-icon class="icon">refresh</mat-icon>
        Limpiar filtros
      </button>
    </div>

    <div class="hero-card-grid">
      @for (hero of paginatedHeroes(); track hero.id) {
        <app-hero-card [hero]="hero" class="card-neon" />
      }
    </div>

    <mat-paginator
      class="neon-paginator"
      [length]="orderedHeroes().length"
      [pageSize]="10"
      [pageIndex]="currentPage() - 1"
      (page)="onPageChange($event)"
    ></mat-paginator>
  </section>
</main>
`
})
export class HomeComponent {
  private heroService = inject(HeroService);

  // Form controls
  genderControl = new FormControl('');
  raceControl = new FormControl('');
  orderControl = new FormControl<'recent' | 'az' | 'za'>('recent');
  publisherControl = new FormControl<'all' | 'marvel' | 'dc' | 'bad'>('all');

  // Computed signals
  paginatedHeroes = computed(() => this.heroService.paginatedHeroes());
  latestHeroes = computed(() => this.heroService.latestHeroes());
  orderedHeroes = computed(() => this.heroService.orderedHeroes());
  genders = computed(() => this.heroService.genders());
  races = computed(() => this.heroService.races());
  currentPage = computed(() => this.heroService.currentPage());

  constructor() {
    this.heroService.loadHeroes();

    this.genderControl.valueChanges.subscribe(v =>
      this.heroService.setFilter('gender', v || '')
    );
    this.raceControl.valueChanges.subscribe(v =>
      this.heroService.setFilter('race', v || '')
    );
    this.orderControl.valueChanges.subscribe(v =>
      this.heroService.setFilter('order', v || 'recent')
    );
    this.publisherControl.valueChanges.subscribe(v =>
      this.heroService.setFilter('publisher', v || 'all')
    );
  }

  resetFilters(): void {
    this.genderControl.setValue('');
    this.raceControl.setValue('');
    this.orderControl.setValue('recent');
    this.publisherControl.setValue('all');
    this.heroService.setPage(1);
  }

  onPageChange(event: { pageIndex: number }): void {
    this.heroService.setPage(event.pageIndex + 1);
  }
}
