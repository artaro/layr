export interface Profile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  currency: string;
  createdAt: string;
}

export interface CreateProfileInput {
  displayName?: string;
  avatarUrl?: string;
  currency?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string;
  currency?: string;
}
