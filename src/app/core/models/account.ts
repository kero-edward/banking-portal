export interface Account {
  id: string;
  customerId: string;
  type: 'Current' | 'Savings';
  currency: string;
  balance: number;
  iban: string;
  status: 'Active' | 'Inactive';
}
