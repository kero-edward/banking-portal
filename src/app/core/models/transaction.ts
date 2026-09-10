export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: 'Debit' | 'Credit';
  amount: number;
  merchant: string;
  category: string;
}
