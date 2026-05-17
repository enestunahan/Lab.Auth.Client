import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlightOnHover]',
  host: {
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
    '[class]': 'currentClasses()',
  },
})
export class HighlightOnHover {
  readonly appHighlightOnHover = input<string>('bg-slate-50');

  protected readonly currentClasses = signal('');

  protected onEnter(): void {
    this.currentClasses.set(this.appHighlightOnHover());
  }

  protected onLeave(): void {
    this.currentClasses.set('');
  }
}
