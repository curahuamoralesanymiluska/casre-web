import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { canUsePointerEffects, smoothFollow } from './motion';

const STRENGTH = 0.3;
const MAX_OFFSET_PX = 10;

/**
 * Efecto "magnético": el botón se desplaza levemente hacia el cursor y vuelve al salir.
 * Usa la propiedad `translate`, que se combina con los `transform` de hover sin pisarlos.
 * Solo en escritorio con mouse y sin movimiento reducido.
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!canUsePointerEffects()) return;

      const el = this.el.nativeElement;
      const listeners = new AbortController();
      const motion = smoothFollow(([x, y]) => (el.style.translate = `${x}px ${y}px`));
      let rect = el.getBoundingClientRect();

      const clamp = (v: number) => Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, v));
      const options = { signal: listeners.signal, passive: true };

      el.addEventListener('pointerenter', () => (rect = el.getBoundingClientRect()), options);
      el.addEventListener(
        'pointermove',
        (e) =>
          motion.set([
            clamp((e.clientX - rect.left - rect.width / 2) * STRENGTH),
            clamp((e.clientY - rect.top - rect.height / 2) * STRENGTH),
          ]),
        options,
      );
      el.addEventListener('pointerleave', () => motion.set([0, 0]), options);

      this.destroyRef.onDestroy(() => {
        listeners.abort();
        motion.stop();
      });
    });
  }
}
