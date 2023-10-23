// Utilities
import { getPersonalizationValue, getValue, setPersonalizationValue, setValue } from "@/js/personalization";
import { clone } from "@/js/utils";
import { defineStore } from "pinia";
import { v4 as uuidV4 } from "uuid";

const emptyPreset = {
  id: 0,
  name: "new Preset",
  image: {
    src: null,
    w: 0,
    h: 0
  },
  font: null,
  fontColor: "#fff",
  textBox: {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    ref: {
      w: 0,
      h: 0
    }
  }
};

const emptyContent = {
  text: "Nickname",
  dataUrl: null
};

export const Routes = {
  PresetEditor: "PresetEditor",
  ContentEditor: "ContentEditor"
};

export const useAppStore = defineStore("app", {
  state: () => ({
    route: null,
    presets: [],
    selectedPresetId: null,
    presetEdit: null,
    contentEdit: emptyContent,
    presetEditor: {
      dragEditEnabled: getValue("dragEditEnabled") ?? true,
    }
  }),
  getters: {
    currentPreset (state) {
      return state.presets.find(preset => preset.id === state.selectedPresetId) || clone(emptyPreset);
    }
  },
  actions: {
    selectPreset (newPreset) {
      this.selectedPresetId = newPreset;
      this.contentEdit = clone(emptyContent);
      this.route = Routes.ContentEditor;
    },
    addPreset () {
      this.presetEdit = JSON.parse(JSON.stringify(emptyPreset));
      this.presetEdit.id = uuidV4();
      this.route = Routes.PresetEditor;
    },
    editPreset () {
      this.presetEdit = JSON.parse(JSON.stringify(this.currentPreset));
      this.route = Routes.PresetEditor;
    },
    deletePreset () {
      const index = this._getPresetIndex(this.currentPreset.id);
      this.presets.splice(index, 1);
      this._persistPresets();

      this.selectedPresetId = null;
      this.route = null;
    },
    savePreset () {
      const index = this._getPresetIndex(this.presetEdit.id);
      this.presets[index] = JSON.parse(JSON.stringify(this.presetEdit));
      this.selectedPresetId = this.presetEdit.id;
      this._persistPresets();

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
    },
    _persistPresets () {
      setPersonalizationValue("presets", clone(this.presets));
    },
    setDragEditEnabled (newValue) {
      this.presetEditor.dragEditEnabled = !!newValue;
      setValue("dragEditEnabled", !!newValue);
    }
  }
});

export async function loadInitialData () {
  // load initial data
  const initialPresets = await getPersonalizationValue("presets");
  const appStore = useAppStore();
  appStore.presets = initialPresets || [];
}
