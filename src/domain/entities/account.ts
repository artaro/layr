import { AccountType } from '../enums/accountType';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  bankName: string | null;
  accountNumberLast4: string | null;
  createdAt: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance?: number;
  bankName?: string;
  accountNumberLast4?: string;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  balance?: number;
  bankName?: string;
  accountNumberLast4?: string;
}
