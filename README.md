# Banking Portal

A responsive banking portal built with Angular for managing customers, accounts, and transactions.

## Technologies

- Angular 22
- TypeScript
- RxJS
- Angular Signals
- Reactive Forms
- PrimeNG
- SCSS
- Static JSON mock data

## Features

### Authentication

- Login screen with email and password validation.
- Redirects to the dashboard after login.

### Dashboard

- Displays available customers.
- Allows selecting a customer.
- Provides access to customer details.

### Customer Details

- Displays customer information.
- Displays the customer's accounts.
- Shows account type, balance, currency, IBAN, and status.

### Transactions

- View transactions for the selected account.
- Filter transactions by date range, transaction type, and category.
- Sort transactions by date and amount.
- Paginate transaction results.
- Create new Debit or Credit transactions.
- Newly created transactions appear immediately.
- Account balance is updated automatically.

### Transaction Validation

- Transaction type is required.
- Amount must be greater than 0.
- Maximum transaction amount is 100,000.
- Amount supports a maximum of 2 decimal places.
- Transaction date cannot be in the future.
- Merchant name must contain between 3 and 50 characters.
- Category is required.
- Debit transactions cannot exceed the available account balance.

### Additional Features

- Mini statement showing the latest transactions.
- CSV export for filtered transactions.
- Transaction insights including:
  - Total debit
  - Total credit
  - Highest spending category
- Loading and error states.
- Cached JSON data to avoid unnecessary HTTP requests.
- Responsive layout for desktop, tablet, and mobile.

## Project Structure

```text
src/app/
├── core/
│   ├── models/
│   │   ├── account.ts
│   │   ├── customer.ts
│   │   └── transaction.ts
│   │
│   └── services/
│       ├── account.ts
│       └── transaction.ts
│
├── components/
│   ├── login/
│   ├── dashboard/
│   ├── customer-details/
│   └── transactions/
│       └── transaction-form/
│
└── app.routes.ts

public/assets/mock/
├── customers.json
├── accounts.json
├── transactions.json
├── transaction-types.json
└── transaction-categories.json
