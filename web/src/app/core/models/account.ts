export interface Account {
  id: string;
  email: string;
  /** Display name. Optional — an account is usable without one. */
  name: string;
  createdAt: Date;
}
