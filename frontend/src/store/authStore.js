import { create } from "zustand";

const STORAGE_KEY = "sms_auth";

const loadAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { user: null, token: null };
    }
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const useAuthStore = create((set) => {
  const initial = loadAuth();

  return {
    user: initial.user,
    token: initial.token,
    login: (user, token) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
      set({ user, token });
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, token: null });
    },
  };
});
