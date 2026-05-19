import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { map, of, switchMap } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  AuthorService,
  BookService,
  CategoryService,
  NotificationService,
  PublisherService,
  type CreateBookPayload,
} from '@core/services';
import { getControlErrorMessage } from '@shared/utils';

@Component({
  selector: 'app-admin-book-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './book-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);
  private readonly authorService = inject(AuthorService);
  private readonly categoryService = inject(CategoryService);
  private readonly publisherService = inject(PublisherService);
  private readonly notification = inject(NotificationService);

  protected readonly publishers = toSignal(this.publisherService.getList(), {
    initialValue: [],
  });
  protected readonly authors = toSignal(this.authorService.getList(), {
    initialValue: [],
  });
  protected readonly categories = toSignal(this.categoryService.getList(), {
    initialValue: [],
  });

  protected readonly currentYear = new Date().getFullYear();

  protected readonly getError = getControlErrorMessage;

  protected readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
    description: this.fb.nonNullable.control('', {
      validators: [Validators.maxLength(2000)],
    }),
    isbn: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.pattern(/^(\d{10}|\d{13})$/)],
    }),
    publicationYear: this.fb.nonNullable.control<number>(this.currentYear, {
      validators: [
        Validators.required,
        Validators.min(1450),
        Validators.max(this.currentYear + 5),
      ],
    }),
    publisherId: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    authorIds: this.fb.nonNullable.control<string[]>([], {
      validators: [Validators.required, this.minSelectionValidator(1)],
    }),
    categoryIds: this.fb.nonNullable.control<string[]>([], {
      validators: [Validators.required, this.minSelectionValidator(1)],
    }),
  });

  private readonly bookId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id'))),
    { initialValue: null },
  );

  protected readonly isEditMode = computed(() => this.bookId() !== null);

  protected readonly editingBook = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')),
      switchMap((id) => (id ? this.bookService.getById(id) : of(null))),
    ),
  );

  constructor() {
    effect(() => {
      const book = this.editingBook();
      if (!book) return;
      this.form.patchValue({
        title: book.title,
        description: book.description ?? '',
        isbn: book.isbn,
        publicationYear: book.publicationYear,
        publisherId: book.publisherId,
        authorIds: book.authors.map((a) => a.id),
        categoryIds: book.categories.map((c) => c.id),
      });
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.error('Formda hatalı alanlar var. Lütfen kontrol et.');
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreateBookPayload = {
      title: value.title,
      description: value.description.trim() === '' ? null : value.description,
      isbn: value.isbn,
      publicationYear: value.publicationYear,
      publisherId: value.publisherId,
    };

    const id = this.bookId();
    if (id) {
      this.bookService.update(id, payload).subscribe({
        next: () => {
          this.notification.success(`"${value.title}" güncellendi.`);
          this.router.navigate(['/admin/books']);
        },
        error: () => this.notification.error('Güncelleme sırasında bir hata oluştu.'),
      });
    } else {
      this.bookService.create(payload).subscribe({
        next: () => {
          this.notification.success(`"${value.title}" eklendi.`);
          this.router.navigate(['/admin/books']);
        },
        error: () => this.notification.error('Kayıt sırasında bir hata oluştu.'),
      });
    }
  }

  protected compareById(a: string, b: string): boolean {
    return a === b;
  }

  private minSelectionValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value as string[] | null) ?? [];
      return value.length >= min ? null : { minSelection: { min, actual: value.length } };
    };
  }
}
