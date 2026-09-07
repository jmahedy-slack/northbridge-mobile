export type Customer = {
  id: string;
  fullName: string;
  preferredName: string;
  email: string;
  membershipNumber: string;
};

export type Account = {
  id: string;
  name: string;
  sortCode: string;
  accountNumber: string;
  currency: 'GBP';
  balancePence: number;
};

export type Transaction = {
  id: string;
  merchant: string;
  category: string;
  amountPence: number;
  bookedAt: string;
  status: 'posted' | 'pending';
};

export type Session = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  customer: Customer;
  accountId: string;
};

export type PaymentDraft = {
  payeeName: string;
  sortCode: string;
  accountNumber: string;
  amountPence: number;
  reference: string;
};
