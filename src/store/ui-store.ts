"use client";

import { create } from "zustand";

type UserRole = "Analyst" | "Operator" | "Admin";

type UiStore = {
  sidebarOpen: boolean;
  role: UserRole;
  setSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  setRole: (role: UserRole) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  role: "Admin",
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setRole: (role) => set({ role })
}));
