import { Component, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { AccountService } from '../../core/services/account';
import { TransactionService } from '../../core/services/transaction';

import { TransactionForm } from './transaction-form/transaction-form';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TransactionForm,
  ],
  selector: 'app-transactions',
  styleUrl: './transactions.scss',
  templateUrl: './transactions.html',
})
export class Transactions {
  private readonly route = inject(ActivatedRoute);

  readonly accountService = inject(AccountService);
  readonly transactionService = inject(TransactionService);

  readonly accountId = signal(this.route.snapshot.paramMap.get('accountId') ?? '');

  readonly account = computed(() =>
    this.accountService.accounts().find((account) => account.id === this.accountId()),
  );

  readonly typeFilter = signal<'Debit' | 'Credit' | ''>('');

  readonly categoryFilter = signal('');

  readonly fromDate = signal('');

  readonly toDate = signal('');

  readonly categories = [
    'Groceries',
    'Bills',
    'Shopping',
    'Transfer',
    'Income',
    'Fees',
    'Entertainment',
  ];

  readonly transactions = computed(() =>
    this.transactionService
      .transactions()
      .filter((transaction) => transaction.accountId === this.accountId()),
  );

  readonly filteredTransactions = computed(() => {
    const type = this.typeFilter();
    const category = this.categoryFilter();
    const from = this.fromDate();
    const to = this.toDate();

    return this.transactions().filter((transaction) => {
      const matchesType = !type || transaction.type === type;

      const matchesCategory = !category || transaction.category === category;

      const matchesFromDate = !from || transaction.date >= from;

      const matchesToDate = !to || transaction.date <= to;

      return matchesType && matchesCategory && matchesFromDate && matchesToDate;
    });
  });

  readonly miniStatement = computed(() =>
    this.transactions()
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5),
  );

  readonly monthlyInsights = computed(() => {
    const transactions = this.transactions();

    const totalDebit = transactions
      .filter((transaction) => transaction.type === 'Debit')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalCredit = transactions
      .filter((transaction) => transaction.type === 'Credit')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const categoryTotals = new Map<string, number>();

    transactions
      .filter((transaction) => transaction.type === 'Debit')
      .forEach((transaction) => {
        const current = categoryTotals.get(transaction.category) ?? 0;

        categoryTotals.set(transaction.category, current + transaction.amount);
      });

    let highestSpendingCategory = 'N/A';
    let highestAmount = 0;

    categoryTotals.forEach((amount, category) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestSpendingCategory = category;
      }
    });

    return {
      totalDebit,
      totalCredit,
      highestSpendingCategory,
    };
  });

  constructor() {
    this.accountService.loadAccounts();
    this.transactionService.loadTransactions();
  }

  clearFilters(): void {
    this.typeFilter.set('');
    this.categoryFilter.set('');
    this.fromDate.set('');
    this.toDate.set('');
  }

  onTransactionCreated(): void {
    // Signals update the table and balance automatically.
  }

  exportCsv(): void {
    const transactions = this.filteredTransactions();

    const header = ['ID', 'Account ID', 'Date', 'Type', 'Amount', 'Merchant', 'Category'];

    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.accountId,
      transaction.date,
      transaction.type,
      transaction.amount.toFixed(2),
      `"${transaction.merchant.replaceAll('"', '""')}"`,
      transaction.category,
    ]);

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'transactions.csv';
    link.click();

    URL.revokeObjectURL(url);
  }
}
