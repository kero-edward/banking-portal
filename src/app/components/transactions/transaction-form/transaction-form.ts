import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Transaction } from '../../../core/models/transaction';
import { TransactionService } from '../../../core/services/transaction';
import { DecimalPipe } from '@angular/common';

function maxTwoDecimalsValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return Number.isInteger(numberValue * 100) ? null : { maxTwoDecimals: true };
}

function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`;

  return value > todayString ? { futureDate: true } : null;
}

@Component({
  imports: [ReactiveFormsModule, DecimalPipe],
  selector: 'app-transaction-form',
  styleUrl: './transaction-form.scss',
  templateUrl: './transaction-form.html',
})
export class TransactionForm {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);

  @Input({ required: true })
  accountId = '';

  @Input()
  accountBalance = 0;

  @Output()
  transactionCreated = new EventEmitter<Transaction>();

  readonly categories = [
    'Groceries',
    'Bills',
    'Shopping',
    'Transfer',
    'Income',
    'Fees',
    'Entertainment',
  ];

  readonly form = this.fb.nonNullable.group(
    {
      type: ['Debit' as 'Debit' | 'Credit', Validators.required],

      amount: [
        0,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(100000),
          maxTwoDecimalsValidator,
        ],
      ],

      date: [this.getToday(), [Validators.required, notFutureDateValidator]],

      merchant: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],

      category: ['', Validators.required],
    },
    {
      validators: [this.insufficientBalanceValidator.bind(this)],
    },
  );

  private insufficientBalanceValidator(form: AbstractControl): ValidationErrors | null {
    const type = form.get('type')?.value;
    const amount = Number(form.get('amount')?.value);

    if (type === 'Debit' && Number.isFinite(amount) && amount > this.accountBalance) {
      return {
        insufficientBalance: true,
      };
    }

    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const transaction: Transaction = {
      id: this.generateTransactionId(),
      accountId: this.accountId,
      date: value.date,
      type: value.type,
      amount: Number(value.amount),
      merchant: value.merchant.trim(),
      category: value.category,
    };

    const created = this.transactionService.addTransaction(transaction);

    if (!created) {
      this.form.setErrors({
        insufficientBalance: true,
      });

      this.form.markAllAsTouched();

      return;
    }

    this.transactionCreated.emit(transaction);

    this.form.reset({
      type: 'Debit',
      amount: 0,
      date: this.getToday(),
      merchant: '',
      category: '',
    });
  }

  private generateTransactionId(): string {
    return `T${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  private getToday(): string {
    const today = new Date();

    return (
      `${today.getFullYear()}-` +
      `${String(today.getMonth() + 1).padStart(2, '0')}-` +
      `${String(today.getDate()).padStart(2, '0')}`
    );
  }
}
