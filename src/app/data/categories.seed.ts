import { Category } from '@core/models';

export const CATEGORIES: readonly Category[] = [
  {
    id: '2b5d5b82-2c80-4c03-8f4f-5a9b9d6b5c77',
    name: 'Klasik',
    description: 'Türk edebiyatının klasik kabul edilen eserleri.',
  },
  {
    id: '1c3a3f8e-b6d4-4ef8-8e7f-56ad52c57d8f',
    name: 'Roman',
    description: 'Uzun soluklu kurgu eserler.',
  },
  {
    id: '35ef77fa-5f76-48ec-9f84-6cc81857232e',
    name: 'Türk Edebiyatı',
    description: 'Yerel yazarların eserleri.',
  },
] as const;
