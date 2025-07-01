import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Superhero } from '../models/superhero.interface';
import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  const superman: Superhero = {
    id: 1,
    slug: 'superman',
    name: 'Superman',
    images: { lg: 'https://cdn...', md: '', sm: '', xs: '' },
    powerstats: {
      intelligence: 85,
      strength: 100,
      speed: 90,
      durability: 95,
      power: 100,
      combat: 85,
    },
    appearance: {
      gender: 'Male',
      race: 'Kryptonian',
      eyeColor: 'Blue',
      hairColor: 'Black',
    },
    biography: {
      alterEgos: 'None',
      aliases: ['Man of Steel'],
      placeOfBirth: 'Krypton',
      firstAppearance: 'Action Comics #1',
      publisher: 'DC Comics',
      alignment: 'good',
    },
    work: {
      occupation: 'Reporter',
      base: 'Metropolis',
    },
    connections: {
      groupAffiliation: 'Justice League',
      relatives: 'Lois Lane',
    },
    createdAt: '2022-01-01T00:00:00.000Z',
  };

  const wonderWoman: Superhero = {
    ...superman,
    id: 2,
    slug: 'wonder-woman',
    name: 'Wonder Woman',
    appearance: { ...superman.appearance, gender: 'Female', race: 'Amazon' },
    biography: { ...superman.biography, publisher: 'Marvel Comics' },
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService],
    });
    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería cargar héroes desde JSON solo una vez', () => {
    service['isLoaded'] = false;
    service.loadHeroes();

    const req = httpMock.expectOne('assets/mockAPI/heroes.json');
    req.flush([superman, wonderWoman]);

    expect(service.heroes().length).toBe(2);
    service.loadHeroes(); // no vuelve a cargar
  });

  it('debería agregar un héroe', () => {
    service.addHero(superman);
    expect(service.heroes().length).toBe(1);
    expect(service.heroes()[0].name).toBe('Superman');
  });

  it('debería asignar createdAt si no se proporciona', () => {
    const { createdAt, ...partialHero } = superman;
    service.addHero(partialHero as Superhero);
    expect(service.heroes()[0].createdAt).toBeDefined();
  });

  it('debería editar un héroe', () => {
    service.addHero(superman);
    const updated = { ...superman, name: 'Superman Prime' };
    service.editHero(updated);
    expect(service.getHeroById(1).name).toBe('Superman Prime');
  });

  it('debería eliminar un héroe', () => {
    service.addHero(superman);
    service.deleteHero(1);
    expect(service.heroes().length).toBe(0);
  });

  it('debería obtener un héroe por ID', () => {
    service.addHero(superman);
    expect(service.getHeroById(1)?.name).toBe('Superman');
  });

  it('debería resetear el currentPage al aplicar un filtro', () => {
    service.setPage(5);
    service.setFilter('gender', 'Male');
    expect(service.currentPage()).toBe(1);
  });

  it('debería filtrar por género, raza, publisher y nombre', () => {
    service.addHero(superman);
    service.addHero(wonderWoman);

    service.setFilter('gender', 'Female');
    expect(service.filteredHeroes()[0].name).toBe('Wonder Woman');

    service.setFilter('race', 'Amazon');
    expect(service.filteredHeroes()[0].name).toBe('Wonder Woman');

    service.setFilter('publisher', 'Marvel Comics');
    expect(service.filteredHeroes()[0].name).toBe('Wonder Woman');

    service.setFilter('name', 'wonder');
    expect(service.filteredHeroes()[0].name).toBe('Wonder Woman');
  });

  it('debería devolver todos si no hay filtros activos', () => {
    service.addHero(superman);
    service.addHero(wonderWoman);
    expect(service.filteredHeroes().length).toBe(2);
  });

  it('debería ordenar de A-Z, Z-A y por fecha reciente', () => {
    service.addHero(superman);
    service.addHero(wonderWoman);

    service.setFilter('order', 'az');
    expect(service.orderedHeroes()[0].name).toBe('Superman');

    service.setFilter('order', 'za');
    expect(service.orderedHeroes()[0].name).toBe('Wonder Woman');

    service.setFilter('order', 'recent');
    expect(service.orderedHeroes()[0].name).toBe('Wonder Woman');
  });

  it('debería aplicar paginación correctamente', () => {
    service.addHero(superman);
    service.addHero(wonderWoman);
    service.setPage(1);
    expect(service.paginatedHeroes().length).toBe(2);
  });

  it('debería devolver los últimos héroes por fecha de creación', () => {
    service.addHero(superman);
    service.addHero(wonderWoman);
    expect(service.latestHeroes()[0].name).toBe('Wonder Woman');
  });



  it('debería manejar valores faltantes de createdAt al ordenar y obtener los últimos', () => {
    const { createdAt, ...heroWithoutDate } = { ...superman, id: 99 };
    service.addHero(heroWithoutDate as Superhero);
    service.setFilter('order', 'recent');

    expect(service.orderedHeroes().length).toBeGreaterThan(0);
    expect(service.latestHeroes().length).toBeGreaterThan(0);
  });
});
