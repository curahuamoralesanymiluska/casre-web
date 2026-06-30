import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-whats-app-floating',
  standalone: true,
  imports: [],
  template: `
    <a
      class="wa-float"
      [href]="waUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="wa-icon">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.474 2.027 7.782L0 32l8.454-2.011A15.927 15.927 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.13 22.09c-.337.947-1.96 1.812-2.68 1.927-.686.11-1.553.155-2.505-.158-.578-.19-1.319-.443-2.266-.87-3.981-1.72-6.582-5.72-6.782-5.987-.2-.267-1.627-2.167-1.627-4.133 0-1.967 1.033-2.934 1.4-3.334.367-.4.8-.5 1.067-.5.267 0 .534 0 .767.013.245.014.573-.093.897.684.337.8 1.144 2.76 1.244 2.96.1.2.167.434.033.7-.133.267-.2.434-.4.667-.2.233-.42.52-.6.7-.2.2-.407.417-.175.817.232.4 1.032 1.701 2.216 2.754 1.52 1.356 2.8 1.777 3.2 1.977.4.2.633.167.867-.1.233-.267 1-.117 1.333.133.333.25 2.267 1.067 2.267 1.067s.333.267.4.5z"/>
      </svg>
      <span class="wa-pulse"></span>
    </a>
  `,
  styleUrl: './whats-app-floating.component.scss'
})
export class WhatsAppFloatingComponent {
  private readonly data = inject(DataService);
  readonly waUrl = this.data.getWhatsAppUrl();
}
