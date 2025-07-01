import {
  Component,
  computed,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { Filters } from '../../models/superhero.interface';
import { HeroService } from '../../services/hero.service';
import { ModalMessageComponent } from '../../shared/modal-message/modal-message.component';
import { GENDERS, ORDERS, PUBLISHERS, RACES } from '../../utils/hero';

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
  templateUrl: './home.component.html',
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
