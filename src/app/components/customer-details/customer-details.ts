import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Customer } from '../../core/models/customer';
import { Account } from '../../core/models/account';
import { CustomerService } from '../../core/services/customer';
import { AccountService } from '../../core/services/account';
import { Header } from '../../shared/components/header/header';

@Component({
  imports: [Header, DecimalPipe],
  selector: 'app-customer-details',
  styleUrl: './customer-details.scss',
  templateUrl: './customer-details.html',
})
export class CustomerDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);
  private readonly accountService = inject(AccountService);

  readonly customer = signal<Customer | null>(null);
  readonly accounts = signal<Account[]>([]);

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');

    if (!customerId) {
      return;
    }

    this.loadCustomer(customerId);
    this.loadAccounts(customerId);
  }

  private loadCustomer(customerId: string): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        const customer = customers.find((item) => item.CIF === customerId);

        if (customer) {
          this.customer.set(customer);
        }
      },
      error: (error) => console.error('Failed to load customer', error),
    });
  }

  private loadAccounts(customerId: string): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        const customerAccounts = accounts.filter((account) => account.customerId === customerId);

        this.accounts.set(customerAccounts);
      },
      error: (error) => console.error('Failed to load accounts', error),
    });
  }
}
