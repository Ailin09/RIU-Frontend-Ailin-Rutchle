import {
  Component,
  inject,
  computed,
  ViewEncapsulation,
  OnInit,
  effect,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HeroService } from '../../services/hero.service';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalMessageComponent } from '../../shared/modal-message/modal-message.component';
import { Filters } from '../../models/superhero.interface';
import { GENDERS, ORDERS, PUBLISHERS, RACES } from '../../utils/hero';
import { MatInputModule } from '@angular/material/input';

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
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HeroCarouselComponent,
    HeroCardComponent,
    MatInputModule,
  ],
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-toolbar class="neon-header">
      <img src="assets/logo.svg" class="main-logo" alt="Logo" />
      <span class="header-spacer"></span>
      <button class="neon-watch-blue" (click)="createHero()">
        <mat-icon class="icon">add</mat-icon>
        Agregar Héroe
      </button>
    </mat-toolbar>

    <main>
      <section class="custom-carousel-bg">
        <app-hero-carousel
          [heroes]="latestHeroes()"
          title="Últimos agregados"
        />
      </section>
      <section class="custom-cardlist-bg card-neon">
        <div class="custom-title">
          <h4 class="neon-title">Todos los héroes</h4>
          <button class="neon-outline icon-left" (click)="resetFilters()">
            <mat-icon class="icon">refresh</mat-icon>
            Limpiar filtros
          </button>
        </div>

        <form [formGroup]="filterForm" class="hero-card-list">
          <mat-form-field appearance="outline" class="neon-form">
            <mat-label>Editorial</mat-label>
            <mat-select formControlName="publisher">
              @for (publisher of publishers; track publisher.value) {
              <mat-option [value]="publisher.value">{{
                publisher.label
              }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="neon-form">
            <mat-label>Género</mat-label>
            <mat-select formControlName="gender">
              @for (gender of genders; track gender.value) {
              <mat-option [value]="gender.value">{{ gender.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="neon-form">
            <mat-label>Raza</mat-label>
            <mat-select formControlName="race">
              @for (race of races; track race.value) {
              <mat-option [value]="race.value">{{ race.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="neon-form">
            <mat-label>Orden</mat-label>
            <mat-select formControlName="order">
              @for (order of orders; track order.value) {
              <mat-option [value]="order.value">{{ order.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="neon-form">
            <mat-label>Buscar por nombre</mat-label>
            <input matInput formControlName="name" placeholder="Ej: Batman" />
          </mat-form-field>
        </form>

        <div class="hero-card-grid">
          @for (hero of paginatedHeroes(); track hero.id) {
          <app-hero-card
            [hero]="hero"
            [onEdit]="onEditHero"
            [onDelete]="onDeleteHero"
            [goToDetail]="goToDetail"
            class="card-neon"
          />
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
  `,
})
export class HomeComponent implements OnInit {
  private heroService = inject(HeroService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  filterForm: FormGroup;
  latestHeroes = this.heroService.latestHeroes;
  orderedHeroes = this.heroService.orderedHeroes;
  paginatedHeroes = this.heroService.paginatedHeroes;

  publishers = PUBLISHERS;
  races = RACES;
  genders = GENDERS;
  orders = ORDERS;
  currentPage = computed(() => this.heroService.currentPage());
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.filterForm = this.fb.group({
      gender: [''],
      race: [''],
      order: ['recent'],
      publisher: ['all'],
      name: [''],
    });

    this.filterForm.valueChanges.subscribe((filters: Filters) => {
      for (const [key, value] of Object.entries(filters)) {
        this.heroService.setFilter(key as keyof Filters, value || '');
      }
    });
  }
  //TODO: al editar no se actualiza la lista ,revisar 
  ngOnInit(): void {
    this.heroService.loadHeroes();
  }

  resetFilters(): void {
    this.filterForm.reset({
      gender: '',
      race: '',
      order: 'recent',
      publisher: 'all',
      name: '',
    });
    this.heroService.setPage(1);
  }

  onPageChange(event: { pageIndex: number }): void {
    this.heroService.setPage(event.pageIndex + 1);
  }
  createHero() {
    this.router.navigate(['/create-hero']);
  }

  onEditHero = (id: number): void => {
    this.router.navigate(['/edit-hero', id]);
  };
//TODO: revisar snackbar , podria agregar uno al crear un nuevo heroe
  onDeleteHero = (id: number): void => {
    this.dialog
      .open(ModalMessageComponent, {
        data: {
          title: 'Eliminar héroe',
          message: '¿Estás segura/o de que querés eliminar este héroe?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.heroService.deleteHero(id);
          this.snackBar.open('Héroe eliminado con éxito', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        }
      });
  };
goToDetail = (id: number): void => {
  console.log('Navegando al detalle del héroe con ID:', id);
  this.router.navigate(['/detail-hero', id]);
};


}
