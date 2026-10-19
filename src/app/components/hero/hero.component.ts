import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { canUsePointerEffects, smoothFollow } from '../../shared/directives/motion';

const TITLE = [
  { text: 'CASRE', accent: true },
  { text: 'INGENIERÍA', accent: false },
];

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly heroRef = viewChild.required<ElementRef<HTMLElement>>('hero');
  private readonly bgRef = viewChild.required<ElementRef<HTMLElement>>('heroBg');
  private readonly glowRef = viewChild.required<ElementRef<HTMLElement>>('heroGlow');
  private readonly contentRef = viewChild.required<ElementRef<HTMLElement>>('heroContent');

  readonly subtitleWords = ['Topografía,', 'Diseño', 'y', 'Construcción'];

  // `order` es la posición de la letra en todo el título, para escalonar la subida
  readonly titleLines = TITLE.map((line, lineIndex) => {
    const offset = TITLE.slice(0, lineIndex).reduce((sum, l) => sum + l.text.length, 0);
    return {
      ...line,
      chars: [...line.text].map((value, i) => ({ value, order: offset + i })),
    };
  });

  constructor() {
    afterNextRender(() => {
      if (canUsePointerEffects()) {
        this.followPointer();
        this.parallaxFallback();
      }
    });
  }

  /** Un brillo naranja suave sigue al mouse. */
  private followPointer(): void {
    const hero = this.heroRef().nativeElement;
    const glow = this.glowRef().nativeElement;
    const listeners = new AbortController();
    const options = { signal: listeners.signal, passive: true };

    const motion = smoothFollow(([gx, gy, opacity]) => {
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      glow.style.opacity = String(opacity);
    }, 0.08);

    hero.addEventListener(
      'pointermove',
      (e) => {
        const rect = hero.getBoundingClientRect();
        motion.set([e.clientX - rect.left, e.clientY - rect.top, 1]);
      },
      options,
    );
    hero.addEventListener(
      'pointerleave',
      (e) => {
        const rect = hero.getBoundingClientRect();
        motion.set([e.clientX - rect.left, e.clientY - rect.top, 0]);
      },
      options,
    );

    this.destroyRef.onDestroy(() => {
      listeners.abort();
      motion.stop();
    });
  }

  /**
   * El parallax se hace con `animation-timeline: scroll()` en el SCSS. Solo en navegadores
   * sin soporte se replica con un listener de scroll que escribe transform/opacity en rAF.
   */
  private parallaxFallback(): void {
    if (CSS.supports('animation-timeline: scroll()')) return;

    const bg = this.bgRef().nativeElement;
    const content = this.contentRef().nativeElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      const progress = y / window.innerHeight;
      bg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      content.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
      content.style.opacity = String(1 - progress * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    });
  }
}
