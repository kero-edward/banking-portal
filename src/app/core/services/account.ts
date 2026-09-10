import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly accountsSignal = signal<Account[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal('');

  readonly accounts = this.accountsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  private loaded = false;

  constructor(private readonly http: HttpClient) {}

  loadAccounts(): void {
    if (this.loaded) {
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set('');

    this.http.get<Account[]>('assets/mock/accounts.json').subscribe({
      next: (accounts) => {
        this.accountsSignal.set(accounts);
        this.loaded = true;
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Unable to load accounts.');
        this.loadingSignal.set(false);
      },
    });
  }

  getAccountById(accountId: string): Account | undefined {
    return this.accountsSignal().find((account) => account.id === accountId);
  }

  updateBalance(accountId: string, amount: number, type: 'Debit' | 'Credit'): boolean {
    const account = this.getAccountById(accountId);

    if (!account || amount <= 0) {
      return false;
    }

    if (type === 'Debit' && amount > account.balance) {
      return false;
    }

    this.accountsSignal.update((accounts) =>
      accounts.map((currentAccount) => {
        if (currentAccount.id !== accountId) {
          return currentAccount;
        }

        const balance =
          type === 'Debit' ? currentAccount.balance - amount : currentAccount.balance + amount;

        return {
          ...currentAccount,
          balance,
        };
      }),
    );

    return true;
  }
}
