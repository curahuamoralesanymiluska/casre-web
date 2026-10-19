import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MagneticDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly data = inject(DataService);
  private readonly progressRef = viewChild.required<ElementRef<HTMLElement>>('progress');
  // La barra de progreso va con animation-timeline: scroll() en CSS; sin soporte, se mueve desde aquí
  private readonly progressFallback = !CSS.supports('animation-timeline: scroll()');
  private progressFrame = 0;

  readonly companyName = this.data.companyInfo.name;

  isScrolled = signal(false);
  menuOpen  = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 40);
    if (this.progressFallback && !this.progressFrame) {
      this.progressFrame = requestAnimationFrame(() => this.updateProgress());
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  scrollToSection(id: string): void {
    this.closeMenu();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  private updateProgress(): void {
    this.progressFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    this.progressRef().nativeElement.style.transform = `scaleX(${progress})`;
  }
}
