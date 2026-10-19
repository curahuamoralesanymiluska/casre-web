import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { canUsePointerEffects, smoothFollow } from './motion';

const MAX_TILT_DEG = 5;
const LIFT_PX = -6;

/**
 * Inclinación 3D sutil al pasar el mouse, con un brillo que sigue al cursor.
 * Solo escribe variables CSS que el componente usa dentro de `transform`:
 * --rx / --ry (grados), --lift (px), --gx / --gy (posición del brillo) y --glare (0 a 1).
 * Solo en escritorio con mouse y sin movimiento reducido.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!canUsePointerEffects()) return;

      const el = this.el.nativeElement;
      const listeners = new AbortController();
      const options = { signal: listeners.signal, passive: true };
      const motion = smoothFollow(([rx, ry, lift, glare]) => {
        el.style.setProperty('--rx', `${rx}deg`);
        el.style.setProperty('--ry', `${ry}deg`);
        el.style.setProperty('--lift', `${lift}px`);
        el.style.setProperty('--glare', String(glare));
      });
      let rect = el.getBoundingClientRect();

      el.addEventListener('pointerenter', () => (rect = el.getBoundingClientRect()), options);
      el.addEventListener(
        'pointermove',
        (e) => {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          el.style.setProperty('--gx', `${x}px`);
          el.style.setProperty('--gy', `${y}px`);
          motion.set([
            (0.5 - y / rect.height) * 2 * MAX_TILT_DEG,
            (x / rect.width - 0.5) * 2 * MAX_TILT_DEG,
            LIFT_PX,
            1,
          ]);
        },
        options,
      );
      el.addEventListener('pointerleave', () => motion.set([0, 0, 0, 0]), options);

      this.destroyRef.onDestroy(() => {
        listeners.abort();
        motion.stop();
      });
    });
  }
}
