import { Injectable, computed, inject, signal } from '@angular/core';
import { Filters, Superhero } from '../models/superhero.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private http = inject(HttpClient);
  apiHeroesUrl = 'assets/mockAPI/heroes.json';
  
  private _heroes = signal<Superhero[]>([]);
  get heroes() {
    return this._heroes.asReadonly();
  }

  private _currentPage = signal<number>(1);
  private _pageSize = 10;

  private _filters = signal<Filters>({
    gender: '',
    race: '',
    order: 'recent',
    publisher: 'all'
  });

  loadHeroes() {
    this.http.get<Superhero[]>(this.apiHeroesUrl).subscribe(data => {
      this._heroes.set(data);
      console.log('Cargados:', data.length);
    });
  }

  setPage(page: number) {
    this._currentPage.set(page);
  }

  setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    this._filters.set({ ...this._filters(), [key]: value });
    this._currentPage.set(1);
  }

  filters = computed(() => this._filters());
  currentPage = computed(() => this._currentPage());

  genders = computed(() =>
    [...new Set(this._heroes().map(h => h.appearance.gender).filter(Boolean))]
  );

  races = computed(() =>
    [...new Set(this._heroes().map(h => h.appearance.race).filter(Boolean))]
  );

  filteredHeroes = computed(() => {
    const heroes = this._heroes();
    const { gender, race, publisher } = this._filters();
    let filtered = [...heroes];

    if (gender) filtered = filtered.filter(h => h.appearance.gender === gender);
    if (race) filtered = filtered.filter(h => h.appearance.race === race);
    if (publisher !== 'all') {
      filtered = publisher === 'bad'
        ? filtered.filter(h => h.biography.alignment === 'bad')
        : filtered.filter(h => h.biography.publisher?.toLowerCase().includes(publisher));
    }

    return filtered;
  });

  orderedHeroes = computed(() => {
    const order = this._filters().order;
    const list = [...this.filteredHeroes()];
    if (order === 'az') return list.sort((a, b) => a.name.localeCompare(b.name));
    if (order === 'za') return list.sort((a, b) => b.name.localeCompare(a.name));
    return list.sort((a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    );
  });

  paginatedHeroes = computed(() => {
    const start = (this._currentPage() - 1) * this._pageSize;
    return this.orderedHeroes().slice(start, start + this._pageSize);
  });

  latestHeroes = computed(() => {
    return [...this._heroes()]
      .sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      )
      .slice(0, 20);
  });
}
