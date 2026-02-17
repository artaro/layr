import { BudgetPeriod } from '../enums/budgetPeriod';
import { Category } from './category';

export interface BudgetGoal {
  id: string;
  userId: string;
  categoryId: string | null;
  targetAmount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  // Joined relation
  category?: Category;
}

export interface CreateBudgetGoalInput {
  categoryId?: string;
  targetAmount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate?: string;
}

export interface UpdateBudgetGoalInput {
  categoryId?: string | null;
  targetAmount?: number;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
}
