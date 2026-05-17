import { Publisher } from '@core/models';

export const PUBLISHERS: readonly Publisher[] = [
  {
    id: '5f2c3d90-9a8e-4cf0-8ef7-7e2bc9a5a111',
    name: 'Yapı Kredi Yayınları',
    country: 'Türkiye',
    website: 'https://kitap.ykykultur.com.tr',
  },
  {
    id: '3a0d9b34-1c9a-4c57-8c31-8897e5b45ef2',
    name: 'İş Bankası Kültür Yayınları',
    country: 'Türkiye',
    website: 'https://isbankyayinevi.com',
  },
] as const;
