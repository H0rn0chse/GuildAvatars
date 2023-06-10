<script setup>
import PresetListPreview from "@/components/PresetListPreview.vue";
import { useAppStore } from "@/store/app";
import { computed } from "vue";

const appStore = useAppStore();

const localPresets = computed(() => {
  return appStore.presets.map(preset => {
    preset.selected = preset.id === appStore.currentPreset;
    return preset;
  });
});

function selectPreset (preset) {
  appStore.currentPreset = preset.id;
}

function addPreset () {
  alert("addPreset");
}

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
          @click="selectPreset(preset)"
        >
          <PresetListPreview :name="preset.name" />
        </v-list-item>
      </v-list>
      <div
        class="addBtn"
        @click="addPreset"
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

  /*temp*/
  background-color: lightcoral;
}

#main h2 {
  /*temp*/
  color: #2b2b2b;
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

  border-top: solid #2b2b2b 1px;
  margin-top: 1rem;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}
</style>
