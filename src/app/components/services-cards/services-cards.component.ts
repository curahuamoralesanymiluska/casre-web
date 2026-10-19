import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { IconComponent } from '../icon/icon.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';

@Component({
  selector: 'app-services-cards',
  standalone: true,
  imports: [CommonModule, IconComponent, RevealDirective, TiltDirective],
  templateUrl: './services-cards.component.html',
  styleUrl: './services-cards.component.scss'
})
export class ServicesCardsComponent {
  private readonly data = inject(DataService);
  // Mostramos los 5 servicios
  readonly services = this.data.services.slice(0, 5);
}