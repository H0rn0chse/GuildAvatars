// Utilities
import { defineStore } from "pinia";

const emptyPreset = {
  id: 0,
  name: "new Preset",
  src: null
};

export const Routes = {
  PresetEditor: "PresetEditor",
  ContentEditor: "ContentEditor"
};

export const useAppStore = defineStore("app", {
  state: () => ({
    route: null,
    presets: new Array(30).fill(0).map((value, index) => {
      return {
        id: index,
        name: `Preset #${index}`,
        src: null
      };
    }),
    selectedPresetId: 0,
    presetEdit: null
  }),
  getters: {
    currentPreset (state) {
      return state.presets.find(preset => preset.id === state.selectedPresetId);
    }
  },
  actions: {
    selectPreset (newPreset) {
      this.selectedPresetId = newPreset;
      this.route = Routes.ContentEditor;
    },
    addPreset () {
      this.presetEdit = JSON.parse(JSON.stringify(emptyPreset));
      this.presetEdit.id = Date.now(); // todo: replace with uuid
      this.route = Routes.PresetEditor;
    },
    editPreset () {
      this.presetEdit = JSON.parse(JSON.stringify(this.currentPreset));
      this.route = Routes.PresetEditor;
    },
    deletePreset () {
      const index = this._getPresetIndex(this.currentPreset.id);
      this.presets.splice(index, 1);
      // todo: persist
      this.selectedPresetId = null;
      this.route = null;
    },
    savePreset () {
      const index = this._getPresetIndex(this.presetEdit.id);
      this.presets[index] = JSON.parse(JSON.stringify(this.presetEdit));
      this.selectedPresetId = this.presetEdit.id;
      // todo: persist
      this.presetEdit = null;
      this.route = Routes.ContentEditor;
    },
    cancelPreset () {
      this.presetEdit = null;
      this.route = Routes.ContentEditor;
    },
    _getPresetIndex (id) {
      const index = this.presets.findIndex(preset => preset.id === id);
      return index > -1 ? index : this.presets.length;
    }
  }
});
