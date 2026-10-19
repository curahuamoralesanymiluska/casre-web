/** El usuario pidió reducir el movimiento: se muestra todo sin animar. */
export function prefersReducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Escritorio con mouse y sin movimiento reducido: solo ahí se activan los efectos que
 * siguen al cursor (tilt, magnético, brillo del hero). En celular quedan desactivados.
 */
export function canUsePointerEffects(): boolean {
  return (
    matchMedia('(hover: hover) and (pointer: fine) and (min-width: 993px)').matches &&
    !prefersReducedMotion()
  );
}

export interface SmoothFollow {
  /** Nuevo objetivo; la interpolación arranca desde el valor actual. */
  set(target: number[]): void;
  stop(): void;
}

/**
 * Interpola varios valores hacia un objetivo en requestAnimationFrame (lerp) y se detiene
 * sola al llegar, así no queda un bucle corriendo cuando el cursor no se mueve.
 * Todos los valores parten de 0, que es el estado de reposo de los efectos.
 */
export function smoothFollow(apply: (values: number[]) => void, ease = 0.14): SmoothFollow {
  let current: number[] = [];
  let target: number[] = [];
  let frame = 0;

  const tick = () => {
    let moving = false;
    current = current.map((value, i) => {
      const delta = target[i] - value;
      if (Math.abs(delta) < 0.01) return target[i];
      moving = true;
      return value + delta * ease;
    });
    apply(current);
    frame = moving ? requestAnimationFrame(tick) : 0;
  };

  return {
    set(next) {
      if (!current.length) current = next.map(() => 0);
      target = next;
      if (!frame) frame = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
