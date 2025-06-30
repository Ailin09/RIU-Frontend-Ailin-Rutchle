import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { loaderInterceptor } from './app/interceptors/loading.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideRouter(routes),
  ],
});
