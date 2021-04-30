import create from "zustand";
import { User } from "../generated/graphql";

type UserStore = {
  user: User | null;
  token: string;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setUserState: (state: { user: User; token: string }) => void;
};

export const useStore = create<UserStore>((set) => ({
  user: null,
  token: "",
  setToken(token: string) {
    set((state) => ({
      ...state,
      token,
    }));
  },
  setUser(user: User) {
    set((state) => ({
      ...state,
      user,
    }));
  },
  setUserState(state: { user: User; token: string }) {
    set(state);
  },
}));
