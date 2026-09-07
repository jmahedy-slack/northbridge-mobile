import { apiRequest } from './client';
import type { Account, PaymentDraft, Transaction } from '../types';

export async function fetchCurrentAccount(): Promise<Account> {
  const data = await apiRequest<{ account: Account }>('/accounts/current');
  return data.account;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const data = await apiRequest<{ transactions: Transaction[] }>(
    '/accounts/current/transactions',
  );
  return data.transactions;
}

export async function submitPayment(draft: PaymentDraft, accountId: string): Promise<{ paymentId: string }> {
  return apiRequest('/payments', {
    method: 'POST',
    accountId,
    body: {
      sourceAccountId: accountId,
      payeeName: draft.payeeName,
      sortCode: draft.sortCode,
      accountNumber: draft.accountNumber,
      amountPence: draft.amountPence,
      reference: draft.reference,
    },
  });
}
