import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction';
import { AccountService } from './account';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly transactionsSignal = signal<Transaction[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal('');

  readonly transactions = this.transactionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  private loaded = false;

  constructor(
    private readonly http: HttpClient,
    private readonly accountService: AccountService,
  ) {}

  loadTransactions(): void {
    if (this.loaded) {
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set('');

    this.http.get<Transaction[]>('assets/mock/transactions.json').subscribe({
      next: (transactions) => {
        this.transactionsSignal.set(transactions);
        this.loaded = true;
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Unable to load transactions.');
        this.loadingSignal.set(false);
      },
    });
  }

  getTransactionsByAccount(accountId: string): Transaction[] {
    return this.transactionsSignal().filter((transaction) => transaction.accountId === accountId);
  }

  addTransaction(transaction: Transaction): boolean {
    const balanceUpdated = this.accountService.updateBalance(
      transaction.accountId,
      transaction.amount,
      transaction.type,
    );

    if (!balanceUpdated) {
      return false;
    }

    this.transactionsSignal.update((transactions) => [transaction, ...transactions]);

    return true;
  }
}
