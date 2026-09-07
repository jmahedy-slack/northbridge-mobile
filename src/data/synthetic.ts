import type { Account, Customer, Transaction } from '../types';

/**
 * All records below are fictional demonstration data.
 * They do not represent a real customer, account, or payment.
 */
export const DEMO_CUSTOMER: Customer = {
  id: 'cust_nb_demo_morgan',
  fullName: 'Alex Morgan',
  preferredName: 'Alex',
  email: 'alex.morgan@northbridge-demo.example',
  membershipNumber: 'NB-1002841',
};

export const DEMO_ACCOUNT: Account = {
  id: 'acc_nb_current_8841',
  name: 'Northbridge Current Account',
  sortCode: '04-00-04',
  accountNumber: '13884346',
  currency: 'GBP',
  balancePence: 842163,
};

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_nb_001',
    merchant: 'Tesco Express',
    category: 'Groceries',
    amountPence: -1450,
    bookedAt: '2026-09-06T18:42:00.000Z',
    status: 'posted',
  },
  {
    id: 'txn_nb_002',
    merchant: 'Pret A Manger',
    category: 'Dining',
    amountPence: -680,
    bookedAt: '2026-09-06T12:10:00.000Z',
    status: 'posted',
  },
  {
    id: 'txn_nb_003',
    merchant: 'TfL',
    category: 'Transport',
    amountPence: -520,
    bookedAt: '2026-09-05T08:22:00.000Z',
    status: 'posted',
  },
  {
    id: 'txn_nb_004',
    merchant: 'British Airways',
    category: 'Travel',
    amountPence: -28450,
    bookedAt: '2026-09-03T09:15:00.000Z',
    status: 'posted',
  },
  {
    id: 'txn_nb_005',
    merchant: 'Northbridge Payroll',
    category: 'Salary',
    amountPence: 425000,
    bookedAt: '2026-08-28T00:01:00.000Z',
    status: 'posted',
  },
  {
    id: 'txn_nb_006',
    merchant: 'Octopus Energy',
    category: 'Electricity',
    amountPence: -9142,
    bookedAt: '2026-08-26T07:30:00.000Z',
    status: 'posted',
  },
];

/** Demo-only credentials. Not a real banking login. */
export const DEMO_LOGIN = {
  username: 'a.morgan',
  password: 'northbridge-demo',
};

/**
 * Synthetic access token issued by the in-app mock identity service.
 * The nb.syn. prefix marks it as demonstration material only.
 */
export const DEMO_ACCESS_TOKEN = 'nb.syn.access.7f3a2c91e04b';
