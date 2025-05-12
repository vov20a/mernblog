import { createContext } from 'react';

export type MenuContextType = {
  activeMenuId: string;
  setActiveMenuId: (str: string) => void;
  isLoading: boolean;
};

export const ActiveMenuContext = createContext<MenuContextType | null>(null);
