export interface Author {
  readonly id: string;
  firstName: string;
  lastName: string;
  biography: string | null;
  birthDate: string | null;
}
