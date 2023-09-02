// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    route: null,
    presets: new Array(30).fill(0).map((value, index) => {
      return {
        id: index,
        name: `Preset #${index}`,
        src: ""
      };
    }),
    currentPreset: 0
  }),
  actions: {
    selectPreset (newPreset) {
      this.route = "ContentEditor";
      this.currentPreset = newPreset;
    },
    addPreset () {
      this.route = "PresetEditor";
    },
    editPreset () {
      this.route = "PresetEditor";
    },
    deletePreset () {
      this.route = null;
    },
    savePreset () {
      this.route = "ContentEditor";
    },
    cancelPreset () {
      this.route = "ContentEditor";
    }
  }
});
