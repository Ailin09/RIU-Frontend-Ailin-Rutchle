import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading = signal(false);
  loading = this._loading.asReadonly();

  show(): void {
    this._loading.set(true);
  }

  hide(): void {
    this._loading.set(false);
  }
}
