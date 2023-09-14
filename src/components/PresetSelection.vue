<script setup>
import PresetListPreview from "@/components/PresetListPreview.vue";
import { useAppStore } from "@/store/app";
import { computed } from "vue";

const appStore = useAppStore();

const localPresets = computed(() => {
  return appStore.presets.map(preset => {
    preset.selected = preset.id === appStore.selectedPresetId;
    return preset;
  });
});

</script>

<template>
  <div id="main">
    <div class="section">
      <h2>Select your preset</h2>
      <v-list>
        <v-list-item
          v-for="preset in localPresets"
          :key="preset.id"
          :active="preset.selected"
          @click="appStore.selectPreset(preset.id)"
        >
          <PresetListPreview :name="preset.name" />
        </v-list-item>
      </v-list>
      <div
        class="addBtn"
        @click="appStore.addPreset"
      >
        <v-btn title="Add Preset">
          Add Preset
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
#main {
  height: 100%;
  overflow: hidden;
  padding: 2rem;

  border-right: solid #cbcbcb 3px;
}

.section {
  display: flex;
  flex-direction: column;

  height: 100%;
  overflow: hidden;
}

.addBtn {
  margin: 0.25rem;
  padding: 0.25rem;

  border-top: solid #cbcbcb 1px;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}
</style>
