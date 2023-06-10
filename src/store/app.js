// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    presets: new Array(30).fill(0).map((value, index) => {
      return {
        id: index,
        name: `Preset #${index}`,
        src: ""
      };
    }),
    currentPreset: 0
  }),
});
