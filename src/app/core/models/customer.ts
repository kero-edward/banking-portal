export interface Customer {
  CIF: string;
  name: string;
  nationalId: string;
  segment: 'Retail' | 'Priority';
  email: string;
  phone: string;
}
