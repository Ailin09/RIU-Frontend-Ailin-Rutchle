import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Superhero } from '../models/superhero.interface';

describe('HeroService', () => {
  let service: HeroService;

  const mockHero: Superhero = {
    id: 1,
    name: 'Spiderman',
    slug: 'spiderman',
    powerstats: {
      intelligence: 90,
      strength: 55,
      speed: 60,
      durability: 70,
      power: 65,
      combat: 80,
    },
    appearance: {
      gender: 'Male',
      race: 'Human',
      eyeColor: 'Hazel',
      hairColor: 'Brown',
    },
    biography: {
      alterEgos: 'No alter egos found.',
      aliases: ['Spidey', 'Web-Slinger'],
      placeOfBirth: 'New York',
      firstAppearance: 'Amazing Fantasy #15',
      publisher: 'Marvel Comics',
      alignment: 'good',
    },
    work: {
      occupation: 'Photographer',
      base: 'New York City',
    },
    connections: {
      groupAffiliation: 'Avengers',
      relatives: 'May Parker (aunt)',
    },
    images: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),            
        provideHttpClientTesting(),   
        HeroService
      ],
    });

    service = TestBed.inject(HeroService);
  });

  it('debería registrar un nuevo héroe', () => {
    service.addHero({ ...mockHero, id: 999 });
    const all = service.heroes();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('Spiderman');
  });

  it('debería consultar todos los héroes', () => {
    service.addHero({ ...mockHero, id: 1 });
    service.addHero({ ...mockHero, id: 2, name: 'Batman' });
    const all = service.heroes();
    expect(all.length).toBe(2);
  });

  it('debería obtener un héroe por ID', () => {
    service.addHero(mockHero);
    const hero = service.getHeroById(1);
    expect(hero?.name).toBe('Spiderman');
  });

  it('debería buscar héroes por nombre', () => {
    service.addHero(mockHero);
    service.setFilter('name', 'spider');
    const result = service.filteredHeroes();
    expect(result.length).toBe(1);
    expect(result[0].name).toContain('Spiderman');
  });

  it('debería modificar un héroe', () => {
    service.addHero(mockHero);
    service.editHero({ ...mockHero, name: 'Spidey' });
    const hero = service.getHeroById(1);
    expect(hero.name).toBe('Spidey');
  });

  it('debería eliminar un héroe', () => {
    service.addHero(mockHero);
    service.deleteHero(1);
    expect(service.heroes().length).toBe(0);
  });
});
