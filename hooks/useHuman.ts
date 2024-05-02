import { create } from "zustand";

interface nameStore {
  name: string;
  age: number;
  setName: () => void;
}

export const useHumanStore = create<nameStore>((set) => ({
  setName() {
    set({ name: "cancan" });
  },
  name: "2",
  age: 31,
}));
