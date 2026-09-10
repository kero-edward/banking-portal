import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Customer } from '../../core/models/customer';
import { Account } from '../../core/models/account';
import { CustomerService } from '../../core/services/customer';
import { AccountService } from '../../core/services/account';
import { Header } from '../../shared/components/header/header';

@Component({
  imports: [Header, DecimalPipe, RouterLink],
  selector: 'app-customer-details',
  styleUrl: './customer-details.scss',
  templateUrl: './customer-details.html',
})
export class CustomerDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  readonly accountService = inject(AccountService);

  readonly customer = signal<Customer | null>(null);
  readonly accounts = signal<Account[]>([]);

  constructor() {
    effect(() => {
      const customerId = this.route.snapshot.paramMap.get('id');

      if (!customerId) {
        return;
      }

      const accounts = this.accountService.accounts();

      if (accounts.length > 0) {
        this.accounts.set(accounts.filter((account) => account.customerId === customerId));
      }
    });
  }

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');

    if (!customerId) {
      return;
    }

    this.loadCustomer(customerId);
    this.accountService.loadAccounts();
  }

  private loadCustomer(customerId: string): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        const customer = customers.find((item) => item.CIF === customerId);

        if (customer) {
          this.customer.set(customer);
        }
      },
      error: (error) => {
        console.error('Failed to load customer', error);
      },
    });
  }
}
