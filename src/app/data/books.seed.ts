export interface BookRaw {
  readonly id: string;
  title: string;
  description: string | null;
  isbn: string;
  publicationYear: number;
  publisherId: string;
}

export interface BookAuthorLink {
  readonly bookId: string;
  readonly authorId: string;
}

export interface BookCategoryLink {
  readonly bookId: string;
  readonly categoryId: string;
}

export const BOOKS_RAW: readonly BookRaw[] = [
  {
    id: '8b1c1b79-fc6e-4d3a-9e55-6f2e2e4b3c10',
    title: 'Kürk Mantolu Madonna',
    description: 'Sabahattin Ali\'nin aşk ve yalnızlık temalarını işleyen klasiği.',
    isbn: '9789750805000',
    publicationYear: 1943,
    publisherId: '5f2c3d90-9a8e-4cf0-8ef7-7e2bc9a5a111',
  },
  {
    id: '0a81f345-62fb-4fbe-9cde-52d69f964bce',
    title: 'Masumiyet Müzesi',
    description: 'Orhan Pamuk\'tan İstanbul\'da geçen modern bir aşk romanı.',
    isbn: '9789750809572',
    publicationYear: 2008,
    publisherId: '5f2c3d90-9a8e-4cf0-8ef7-7e2bc9a5a111',
  },
  {
    id: 'e2c73d7f-5123-4b7f-9cf7-9f1d0105d01c',
    title: 'Çalıkuşu',
    description: 'Reşat Nuri Güntekin\'in idealist öğretmen Feride\'nin hikâyesi.',
    isbn: '9789754700110',
    publicationYear: 1922,
    publisherId: '3a0d9b34-1c9a-4c57-8c31-8897e5b45ef2',
  },
] as const;

export const BOOK_AUTHORS: readonly BookAuthorLink[] = [
  {
    bookId: '8b1c1b79-fc6e-4d3a-9e55-6f2e2e4b3c10',
    authorId: '2f5fb6ae-0561-4b65-92f5-5a6f0ca6c7d1',
  },
  {
    bookId: '0a81f345-62fb-4fbe-9cde-52d69f964bce',
    authorId: '4a3f34c3-8a7c-4cbc-9c24-1ff717a8ba4a',
  },
  {
    bookId: 'e2c73d7f-5123-4b7f-9cf7-9f1d0105d01c',
    authorId: '8c3efaa3-3b94-4f17-bc2e-98e035a668cd',
  },
] as const;

export const BOOK_CATEGORIES: readonly BookCategoryLink[] = [
  {
    bookId: '8b1c1b79-fc6e-4d3a-9e55-6f2e2e4b3c10',
    categoryId: '2b5d5b82-2c80-4c03-8f4f-5a9b9d6b5c77',
  },
  {
    bookId: '8b1c1b79-fc6e-4d3a-9e55-6f2e2e4b3c10',
    categoryId: '35ef77fa-5f76-48ec-9f84-6cc81857232e',
  },
  {
    bookId: '0a81f345-62fb-4fbe-9cde-52d69f964bce',
    categoryId: '1c3a3f8e-b6d4-4ef8-8e7f-56ad52c57d8f',
  },
  {
    bookId: '0a81f345-62fb-4fbe-9cde-52d69f964bce',
    categoryId: '35ef77fa-5f76-48ec-9f84-6cc81857232e',
  },
  {
    bookId: 'e2c73d7f-5123-4b7f-9cf7-9f1d0105d01c',
    categoryId: '2b5d5b82-2c80-4c03-8f4f-5a9b9d6b5c77',
  },
  {
    bookId: 'e2c73d7f-5123-4b7f-9cf7-9f1d0105d01c',
    categoryId: '35ef77fa-5f76-48ec-9f84-6cc81857232e',
  },
] as const;
