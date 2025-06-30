import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HeroService } from '../../services/hero.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHeroService: any;
  let mockRouter: any;
  let mockDialog: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockHeroService = {
      latestHeroes: signal([]),
      orderedHeroes: signal([]),
      paginatedHeroes: signal([]),
      currentPage: () => 1,
      loadHeroes: jasmine.createSpy('loadHeroes'),
      setPage: jasmine.createSpy('setPage'),
      setFilter: jasmine.createSpy('setFilter'),
      deleteHero: jasmine.createSpy('deleteHero'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true),
      }),
    };

    mockSnackBar = {
      open: jasmine.createSpy('open'),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, BrowserAnimationsModule],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a loadHeroes en ngOnInit', () => {
    expect(mockHeroService.loadHeroes).toHaveBeenCalled();
  });

  it('debería navegar al crear un héroe', () => {
    component.createHero();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-hero']);
  });

  it('debería navegar al editar un héroe', () => {
    component.onEditHero(5);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit-hero', 5]);
  });

  it('debería eliminar un héroe al confirmar el diálogo', fakeAsync(() => {
    component.onDeleteHero(1);
    tick(); 
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(1);
    expect(mockSnackBar.open).toHaveBeenCalled();
  }));
});
