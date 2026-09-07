import { login, logout, restoreSession, SESSION_STORAGE_KEY, AuthError, resetAuthStateForTests } from '../src/auth/sessionService';
import { DEMO_ACCESS_TOKEN, DEMO_CUSTOMER, DEMO_LOGIN } from '../src/data/synthetic';
import { fetchCurrentAccount, fetchTransactions, submitPayment } from '../src/api/banking';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('authentication (baseline)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await resetAuthStateForTests();
  });

  it('signs in with valid synthetic credentials', async () => {
    const session = await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    expect(session.customer.fullName).toBe(DEMO_CUSTOMER.fullName);
    expect(session.accessToken).toBe(DEMO_ACCESS_TOKEN);
  });

  it('rejects unrecognised credentials', async () => {
    await expect(login('a.morgan', 'wrong-password')).rejects.toBeInstanceOf(AuthError);
  });

  it('restores a session after login', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    const restored = await restoreSession();
    expect(restored?.customer.id).toBe(DEMO_CUSTOMER.id);
    expect(restored?.accessToken).toBe(DEMO_ACCESS_TOKEN);
  });

  it('clears the session on logout', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await logout();
    await expect(restoreSession()).resolves.toBeNull();
  });
});

describe('banking data (baseline)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await resetAuthStateForTests();
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
  });

  it('returns the Northbridge current account', async () => {
    const account = await fetchCurrentAccount();
    expect(account.name).toBe('Northbridge Current Account');
    expect(account.balancePence).toBe(842163);
  });

  it('returns the seeded transactions', async () => {
    const transactions = await fetchTransactions();
    expect(transactions.map((txn) => txn.merchant)).toEqual([
      'Tesco',
      'British Airways',
      'Northbridge Payroll',
      'Octopus Energy',
    ]);
  });

  it('accepts a simulated payment', async () => {
    const result = await submitPayment(
      {
        payeeName: 'Jordan Hale',
        sortCode: '20-45-77',
        accountNumber: '40193827',
        amountPence: 2500,
        reference: 'Dinner',
      },
      'acc_nb_current_8841',
    );
    expect(result.paymentId).toMatch(/^pay_/);
  });

  it('allows login after logout', async () => {
    await logout();
    const session = await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    expect(session.accessToken).toBe(DEMO_ACCESS_TOKEN);
    const account = await fetchCurrentAccount();
    expect(account.name).toBe('Northbridge Current Account');
  });
});

describe('storage key (baseline)', () => {
  it('uses the documented session key', () => {
    expect(SESSION_STORAGE_KEY).toBe('northbridge.session');
  });
});
