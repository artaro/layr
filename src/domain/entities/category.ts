export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}
