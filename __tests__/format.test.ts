import { formatPounds, maskAccountNumber } from '../src/format';

describe('display formatting', () => {
  it('masks an account number in the overview style', () => {
    expect(maskAccountNumber('13884346')).toBe('**** **** 4346');
  });

  it('prefixes a unicode minus for debits', () => {
    expect(formatPounds(-17735)).toBe('−£177.35');
  });
});
