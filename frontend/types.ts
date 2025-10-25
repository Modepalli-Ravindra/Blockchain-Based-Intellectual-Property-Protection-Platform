export interface User {
  id: string;
  name: string;
  email: string;
  rewards: number;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  description: string;
  fileType: string;
  hash: string;
  timestamp: string;
}

export interface ShareRecord {
  id: string;
  assetId: string;
  ownerId: string;
  recipientId: string;
  timestamp: string;
}

export interface SharedAsset {
  asset: Asset;
  owner: User;
  sharedAt: string;
}


export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  addReward: (points: number) => void;
  updateUser: (details: { name: string; email: string }) => Promise<void>;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}