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
    publisher: 'all',
    name: '',
  });
private isLoaded = false;

loadHeroes(): void {
  if (this.isLoaded) return;
  this.http.get<Superhero[]>(this.apiHeroesUrl).subscribe((data) => {
    this._heroes.set(data);
    this.isLoaded = true;
  });
}

addHero(newHero: Superhero): void {
  this._heroes.update((current) => {
    const nextId = current.length > 0 ? Math.max(...current.map(h => h.id)) + 1 : 1;
    const heroToAdd = {
      ...newHero,
      id: nextId,
      createdAt: new Date().toISOString(),
    };
    return [...current, heroToAdd];
  });
}

editHero(updatedHero: Superhero): void {
  this._heroes.update((heroes) =>
    heroes.map((hero) =>
      hero.id === updatedHero.id ? { ...updatedHero } : hero
    )
  );
  console.log('heroooo', updatedHero);
}



deleteHero(id: number): void {
  this._heroes.update((heroes) => heroes.filter((h) => h.id !== id));
}

  getHeroById(id: number): Superhero {
    return this.heroes().find((h) => h.id === id)!;
  }

  setPage(page: number): void {
    this._currentPage.set(page);
  }

  setFilter<K extends keyof Filters>(key: K, value: Filters[K]): void {
    this._filters.set({ ...this._filters(), [key]: value });
    this._currentPage.set(1);
  }

  filters = computed(() => this._filters());
  currentPage = computed(() => this._currentPage());

 filteredHeroes = computed(() => {
  const heroes = this._heroes();
  const { gender, race, publisher, name } = this._filters();
  let filtered = [...heroes];

  if (gender && gender !== '-') {
    filtered = filtered.filter((h) => h.appearance.gender === gender);
  }

  if (race && race !== '-') {
    filtered = filtered.filter((h) => h.appearance.race === race);
  }

  if (publisher && publisher !== 'all') {
    filtered = filtered.filter(
      (h) => h.biography.publisher === publisher
    );
  }

  if (name?.trim()) {
    filtered = filtered.filter((h) =>
      h.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return filtered;
});


orderedHeroes = computed(() => {
  const order = this._filters().order;
  const list = [...this.filteredHeroes()];

  if (order === 'az') return list.sort((a, b) => a.name.localeCompare(b.name));
  if (order === 'za') return list.sort((a, b) => b.name.localeCompare(a.name));
  return list.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );
});


paginatedHeroes = computed(() => {
  const start = (this._currentPage() - 1) * this._pageSize;
  return this.orderedHeroes().slice(start, start + this._pageSize);
});

latestHeroes = computed(() => {
  return [...this._heroes()]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 20);
});

}
