import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./app-loader.component.scss'],
  template: `
    @if (isLoading()) {
      <div class="global-loader-overlay">
        <div class="loader-box">
          <div class="glow-circle"></div>
          <div class="glow-text">Cargando...</div>
        </div>
      </div>
    }
  `
})
export class AppLoaderComponent {
  private loader = inject(LoaderService);
  isLoading = computed(() => this.loader.loading());
}
