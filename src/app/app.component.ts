import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLoaderComponent } from './shared/app-loader/app-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppLoaderComponent], 
  template: `
    <app-loader /> 
    <router-outlet />
  `
})
export class AppComponent {
title = 'riu-frontend-ailin-rutchle';
 
}
