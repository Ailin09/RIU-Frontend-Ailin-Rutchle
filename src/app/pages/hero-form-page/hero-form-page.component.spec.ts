import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroFormPageComponent } from './hero-form-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../services/hero.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Superhero } from '../../models/superhero.interface';

describe('Componente HeroFormPageComponent', () => {
  let componente: HeroFormPageComponent;
  let fixture: ComponentFixture<HeroFormPageComponent>;
  let servicioHeroeEspia: jasmine.SpyObj<HeroService>;
  let routerEspia: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    servicioHeroeEspia = jasmine.createSpyObj('HeroService', [
      'loadHeroes',
      'getHeroById',
      'addHero',
      'editHero',
    ]);

    routerEspia = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeroFormPageComponent, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: HeroService, useValue: servicioHeroeEspia },
        { provide: Router, useValue: routerEspia },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormPageComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería llamar a addHero y navegar al enviar (modo creación)', () => {
    componente.isEditMode.set(false);
    const heroeMock = { id: 999, name: 'Mock Hero' } as any;

    servicioHeroeEspia.addHero.and.callFake(() => {});
    routerEspia.navigate.and.returnValue(Promise.resolve(true));

    componente.onSubmit(heroeMock);

    expect(servicioHeroeEspia.addHero).toHaveBeenCalledWith(heroeMock);
    expect(routerEspia.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería llamar a editHero y navegar al enviar (modo edición)', () => {
    componente.isEditMode.set(true);
    const heroeEditado = { id: 123, name: 'Updated Hero' } as any;

    servicioHeroeEspia.editHero.and.callFake(() => {});
    routerEspia.navigate.and.returnValue(Promise.resolve(true));

    componente.onSubmit(heroeEditado);

    expect(servicioHeroeEspia.editHero).toHaveBeenCalledWith(heroeEditado);
    expect(routerEspia.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería activar modo edición y cargar el héroe si hay ID en la ruta', async () => {
    const heroMock: Superhero = {
      id: 7,
      name: 'Mock Hero',
      slug: 'mock-hero',
      powerstats: {
        intelligence: 50,
        strength: 50,
        speed: 50,
        durability: 50,
        power: 50,
        combat: 50,
      },
      appearance: {
        gender: 'Male',
        race: 'Human',
        eyeColor: 'Brown',
        hairColor: 'Black',
      },
      biography: {
        alterEgos: '',
        aliases: [],
        placeOfBirth: '',
        firstAppearance: '',
        publisher: 'Mock Publisher',
        alignment: 'good',
      },
      work: {
        occupation: '',
        base: '',
      },
      connections: {
        groupAffiliation: '',
        relatives: '',
      },
      images: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
      },
       createdAt: '2024-01-01T00:00:00Z',
    };

    const routeStub = {
      paramMap: of({ get: () => '7' }),
    };
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HeroFormPageComponent, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: HeroService, useValue: servicioHeroeEspia },
        { provide: Router, useValue: routerEspia },
        { provide: ActivatedRoute, useValue: routeStub },
      ],
    }).compileComponents();

    servicioHeroeEspia.getHeroById.and.returnValue(heroMock);

    fixture = TestBed.createComponent(HeroFormPageComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    expect(componente.isEditMode()).toBeTrue();
    expect(componente.hero()).toEqual(heroMock);
  });
});
