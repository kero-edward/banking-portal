import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly httpClient = inject(HttpClient);

  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>('assets/mock/customers.json');
  }
}
