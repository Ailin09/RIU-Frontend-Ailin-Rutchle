import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailHeroComponent } from './detail-hero.component';
import { HeroDetailComponent } from '../../components/hero-detail/hero-detail.component';
import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DetailHeroComponent', () => {
  let component: DetailHeroComponent;
  let fixture: ComponentFixture<DetailHeroComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
       imports: [
        DetailHeroComponent, 
        HeroDetailComponent, 
        HttpClientTestingModule 
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '5', 
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente padre y pasar el ID al hijo', () => {
    expect(component).toBeTruthy();
    const child = fixture.debugElement.query(By.css('app-hero-detail'));
    expect(child).toBeTruthy();
    expect(component.heroId).toBe(5);
  });
});
