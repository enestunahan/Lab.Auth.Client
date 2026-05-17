import { Author } from '@core/models';

export const AUTHORS: readonly Author[] = [
  {
    id: '2f5fb6ae-0561-4b65-92f5-5a6f0ca6c7d1',
    firstName: 'Sabahattin',
    lastName: 'Ali',
    biography:
      'Türk edebiyatının unutulmaz yazarlarından; toplumsal ve psikolojik derinliğiyle bilinir.',
    birthDate: '1907-02-25T00:00:00Z',
  },
  {
    id: '4a3f34c3-8a7c-4cbc-9c24-1ff717a8ba4a',
    firstName: 'Orhan',
    lastName: 'Pamuk',
    biography: 'Nobel ödüllü yazar; İstanbul ve kimlik temalarıyla öne çıkar.',
    birthDate: '1952-06-07T00:00:00Z',
  },
  {
    id: '8c3efaa3-3b94-4f17-bc2e-98e035a668cd',
    firstName: 'Reşat Nuri',
    lastName: 'Güntekin',
    biography: 'Anadolu insanını ve idealizmi merkeze alan klasik romanların yazarı.',
    birthDate: '1889-11-25T00:00:00Z',
  },
] as const;
