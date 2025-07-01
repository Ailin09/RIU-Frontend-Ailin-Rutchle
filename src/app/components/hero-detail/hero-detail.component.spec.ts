import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../../services/hero.service';
import { LoaderService } from '../../services/loader.service';
import { Superhero } from '../../models/superhero.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let component: HeroDetailComponent;
  let heroService: HeroService;
  let loaderService: LoaderService;

  const heroMock: Superhero = {
    id: 1,
    slug: 'superman',
    name: 'Superman Prime',
    images: { lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-widow.jpg', md: '', sm: '', xs: '' },
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
      aliases: ['Clark Kent'],
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
    createdAt: '2022-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailComponent,   HttpClientTestingModule],
      providers: [HeroService, LoaderService],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;

    heroService = TestBed.inject(HeroService);
    loaderService = TestBed.inject(LoaderService);

    spyOn(heroService, 'getHeroById').and.returnValue(heroMock);
    spyOn(loaderService, 'show').and.callThrough();
    spyOn(loaderService, 'hide').and.callThrough();

    // @ts-ignore
    component['heroId'] = () => 1;
  });

  it('debería mostrar loader y cargar héroe al iniciar', fakeAsync(() => {
    component.ngOnInit();

    expect(loaderService.show).toHaveBeenCalled();

    tick(600);
    fixture.detectChanges();

    expect(heroService.getHeroById).toHaveBeenCalledWith(1);
    expect(component.hero()).toEqual(heroMock);
    expect(loaderService.hide).toHaveBeenCalled();

    flush(); 
  }));
  it('debería llamar a history.back() al ejecutar goBack', () => {
  const spy = spyOn(history, 'back');
  component.goBack();
  expect(spy).toHaveBeenCalled();
});

});
