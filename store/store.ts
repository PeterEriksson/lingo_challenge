import { create } from "zustand";

interface LanguageStringState {
  selectedLanguageString: string;
  setSelectedLanguageString: (language: string) => void;
}

const useLanguageStringStore = create<LanguageStringState>((set) => ({
  selectedLanguageString: "",
  setSelectedLanguageString: (language: string) =>
    set({ selectedLanguageString: language }),
}));

export { useLanguageStringStore };
