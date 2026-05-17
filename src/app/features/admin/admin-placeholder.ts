import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-placeholder',
  imports: [RouterLink],
  template: `
    <section class="space-y-4">
      <h1 class="text-3xl font-bold tracking-tight">Yönetim Paneli</h1>
      <p class="text-slate-600">
        Admin panel Adım 8'de geliyor. O zaman bu route <code class="rounded bg-slate-100 px-1.5">loadChildren</code>
        ile lazy chunk haline getirilecek.
      </p>
      <a
        routerLink="/"
        class="inline-block text-sm text-slate-500 hover:text-slate-900"
      >
        ← Ana sayfaya dön
      </a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlaceholder {}
