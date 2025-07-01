import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroCardComponent } from './hero-card.component';
import { Superhero } from '../../models/superhero.interface';
import { By } from '@angular/platform-browser';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;

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
    imports: [HeroCardComponent],
  }).compileComponents();

  fixture = TestBed.createComponent(HeroCardComponent);
  component = fixture.componentInstance;

  fixture.componentRef.setInput('hero', heroMock);
  fixture.componentRef.setInput('goToDetail', (id: number) => {
    expect(id).toBe(heroMock.id);
  });

  fixture.detectChanges();
});


  it('should call goToDetail with hero ID when "Ver más" button is clicked', () => {
    const button = fixture.debugElement.query(By.css('.view-more-overlay'));
    expect(button).toBeTruthy();
    button.nativeElement.click(); 
  });
});
