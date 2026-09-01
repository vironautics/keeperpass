import { create } from 'zustand';

type Account = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

const EMPTY_ACCOUNT: Account = { id: '', email: '', name: '', createdAt: new Date(0) };

type AccountStoreState = {
  account: Account;
  updateProfile: (profile: { email: string; name: string }) => void;
  reset: () => void;
};

const useAccountStore = create<AccountStoreState>((set) => ({
  account: EMPTY_ACCOUNT,
  updateProfile: (profile) => set((state) => ({ account: { ...state.account, ...profile } })),
  reset: () => set({ account: EMPTY_ACCOUNT }),
}));

export { useAccountStore };
export type { Account };
