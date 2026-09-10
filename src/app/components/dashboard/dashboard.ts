import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Customer } from '../../core/models/customer';
import { CustomerService } from '../../core/services/customer';
import { Header } from '../../shared/components/header/header';

@Component({
  imports: [Header, RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  readonly customers = signal<Customer[]>([]);

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => this.customers.set(customers),
      error: (error) => console.error('Failed to load customers', error),
    });
  }
}
