import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { prefersReducedMotion } from './motion';

export type RevealVariant = '' | 'curtain' | 'curtain-left' | 'words';

/**
 * Revela el elemento al entrar en pantalla (estilos en styles/identity.scss).
 * - Navegadores con `animation-timeline: view()`: la animación va ligada al scroll, solo con CSS.
 * - El resto: IntersectionObserver añade `is-visible` una sola vez y la animación corre por tiempo.
 *
 * Variantes: '' (sube con fade), 'curtain' / 'curtain-left' (cortina con clip-path, para
 * imágenes) y 'words' (divide el texto en palabras que suben desde una máscara, para títulos).
 * El escalonado se controla con la variable CSS `--i` en el elemento.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
    '[class.reveal--curtain]': "appReveal() === 'curtain'",
    '[class.reveal--curtain-left]': "appReveal() === 'curtain-left'",
    '[class.reveal--words]': "appReveal() === 'words'",
  },
})
export class RevealDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly appReveal = input<RevealVariant>('');

  constructor() {
    afterNextRender(() => {
      const host = this.el.nativeElement;
      if (this.appReveal() === 'words') splitWords(host);

      if (prefersReducedMotion() || CSS.supports('animation-timeline: view()')) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          observer.disconnect();
          host.classList.add('is-visible');
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      observer.observe(host);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

/** Envuelve cada palabra en una máscara; `--w` es su posición para el escalonado. */
function splitWords(host: HTMLElement): void {
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  let index = 0;
  for (const node of textNodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.append(part);
        continue;
      }
      const mask = document.createElement('span');
      const word = document.createElement('span');
      mask.className = 'reveal__word';
      word.className = 'reveal__word-inner';
      word.style.setProperty('--w', String(index++));
      word.textContent = part;
      mask.append(word);
      fragment.append(mask);
    }
    node.replaceWith(fragment);
  }
}
