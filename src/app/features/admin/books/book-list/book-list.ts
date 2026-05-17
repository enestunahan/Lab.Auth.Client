import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-book-list',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './book-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {}
