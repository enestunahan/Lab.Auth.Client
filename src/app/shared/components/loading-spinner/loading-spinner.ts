import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', '[attr.aria-label]': 'label() || "Yükleniyor"' },
})
export class LoadingSpinner {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly label = input<string | null>(null);

  protected readonly sizeClasses = computed(() => {
    switch (this.size()) {
      case 'sm': return 'h-4 w-4 border-2';
      case 'lg': return 'h-8 w-8 border-[3px]';
      default:   return 'h-5 w-5 border-2';
    }
  });
}
