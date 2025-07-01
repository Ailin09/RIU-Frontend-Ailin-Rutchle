import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroCarouselComponent } from './hero-carousel.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core';
import { Superhero } from '../../models/superhero.interface';

describe('HeroCarouselComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: HeroCarouselComponent;

  const mockHeroes: Superhero[] = [
    {
      id: 1,
      name: 'Spider-Man',
      slug: 'spider-man',
      powerstats: {
        intelligence: 90,
        strength: 55,
        speed: 67,
        durability: 75,
        power: 74,
        combat: 85,
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
        placeOfBirth: 'Queens, New York',
        firstAppearance: 'Amazing Fantasy #15',
        publisher: 'Marvel Comics',
        alignment: 'good',
      },
      work: {
        occupation: 'Photographer',
        base: 'New York',
      },
      connections: {
        groupAffiliation: 'Avengers',
        relatives: 'Aunt May (aunt), Uncle Ben (uncle, deceased)',
      },
      images: { lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-widow.jpg', md: '', sm: '', xs: '' },
      createdAt: new Date().toISOString(),
    },
  ];

  @Component({
    standalone: true,
    imports: [HeroCarouselComponent],
    template: `<app-hero-carousel [heroes]="heroes" />`,
  })
  class TestHostComponent {
    heroes = mockHeroes;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const carouselEl = fixture.debugElement.children[0];
    component = carouselEl.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería retornar 1 slide si el ancho es menor a 600', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    expect(component.getSlidesPerView()).toBe(1);
  });

  it('debería retornar min(3, heroes.length) si ancho entre 600 y 900', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(700);
    expect(component.getSlidesPerView()).toBe(Math.min(3, mockHeroes.length));
  });

  it('debería retornar min(5, heroes.length) si ancho mayor a 900', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1200);
    expect(component.getSlidesPerView()).toBe(Math.min(5, mockHeroes.length));
  });

  it('debería retornar slide inicial centrado', () => {
    expect(component.getInitialSlide()).toBe(Math.floor(mockHeroes.length / 2));
  });

  it('debería detectar héroe como nuevo si fue creado en las últimas 24h', () => {
    const hero = { ...mockHeroes[0], createdAt: new Date().toISOString() };
    expect(component.isNewHero(hero)).toBeTrue();
  });

  it('debería detectar héroe como antiguo si fue creado hace más de 1 día', () => {
    const hero = {
      ...mockHeroes[0],
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), 
    };
    expect(component.isNewHero(hero)).toBeFalse();
  });
it('debería retornar Math.min(3, heroes.length) si el ancho es exactamente 600', () => {
  spyOnProperty(window, 'innerWidth').and.returnValue(600);
  expect(component.getSlidesPerView()).toBe(Math.min(3, mockHeroes.length));
});
it('debería retornar Math.min(5, heroes.length) si el ancho es exactamente 900', () => {
  spyOnProperty(window, 'innerWidth').and.returnValue(900);
  expect(component.getSlidesPerView()).toBe(Math.min(5, mockHeroes.length));
});
it('debería marcar al héroe como nuevo en el template si fue creado recientemente', () => {
  const newHero = {
    ...mockHeroes[0],
    createdAt: new Date().toISOString()
  };
  fixture.componentInstance.heroes = [newHero];
  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.textContent?.toLowerCase()).toContain('nuevo'); 
});
it('debería retornar false si createdAt está indefinido', () => {
  const hero = { ...mockHeroes[0], createdAt: undefined as any };
  expect(component.isNewHero(hero)).toBeFalse();
});

});
