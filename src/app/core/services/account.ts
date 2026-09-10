import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly httpClient = inject(HttpClient);

  getAccounts(): Observable<Account[]> {
    return this.httpClient.get<Account[]>('assets/mock/accounts.json');
  }
}
