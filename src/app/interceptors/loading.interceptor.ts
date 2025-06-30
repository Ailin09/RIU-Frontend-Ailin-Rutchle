import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, tap, delay, of, switchMap } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  loader.show();
  const MIN_DURATION = 2000; 

  const start = performance.now();

  return next(req).pipe(
    switchMap(response => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      return of(response).pipe(delay(remaining));
    }),
    finalize(() => loader.hide())
  );
};
