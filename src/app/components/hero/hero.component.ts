import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private readonly data = inject(DataService);
  readonly company = this.data.companyInfo;

  scrollToQuote(): void {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToServices(): void {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  }
}
