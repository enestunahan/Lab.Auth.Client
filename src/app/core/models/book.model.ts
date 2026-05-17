export interface Book {
  readonly id: string;
  title: string;
  description: string | null;
  isbn: string;
  publicationYear: number;
}

export interface BookDetail extends Book {
  publisherId: string;
  publisherName: string | null;
  authors: BookAuthorRef[];
  categories: BookCategoryRef[];
}

export interface BookAuthorRef {
  readonly id: string;
  firstName: string;
  lastName: string;
}

export interface BookCategoryRef {
  readonly id: string;
  name: string;
}
