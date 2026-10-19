import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'total-station'
  | 'parcels'
  | 'helmet'
  | 'map'
  | 'water';

/**
 * Íconos de línea de topografía e ingeniería (SVG inline, sin peticiones extra).
 * Todos comparten la misma grilla de 24px y grosor de trazo; el color se hereda (currentColor).
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'casre__icon', 'aria-hidden': 'true' },
  styles: `
    :host { display: inline-flex; width: 1em; height: 1em; }
    svg { width: 100%; height: 100%; }
  `,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (name()) {
        @case ('total-station') {
          <!-- Estación total / teodolito sobre trípode -->
          <rect x="8" y="2.5" width="8" height="7" rx="1" />
          <circle cx="12" cy="6" r="1.8" />
          <path d="M7 9.5h10M12 9.5v2.5M12 12l-6 9M12 12l6 9M12 12v9" />
        }
        @case ('parcels') {
          <!-- Catastro: lotes subdivididos -->
          <path d="M3 3h18v18H3zM3 10h10M13 3v18M13 14h8M8 10v11" />
          <circle cx="17" cy="8.5" r="1.2" />
        }
        @case ('helmet') {
          <!-- Casco de obra -->
          <path d="M4 15a8 8 0 0 1 16 0" />
          <path d="M10 7.3V12M14 7.3V12" />
          <path d="M2.5 15h19v2a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 17z" />
        }
        @case ('map') {
          <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
          <path d="M9 4v13.5M15 6.5V20" />
        }
        @case ('water') {
          <path d="M12 3s-5 5.5-5 9a5 5 0 0 0 10 0c0-3.5-5-9-5-9z" />
          <path d="M3 20.5c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
}
