<script setup>
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

</script>

<template>
  <div id="main">
    <h2>PresetEditor</h2>
    <div id="footer">
      <v-btn @click="appStore.savePreset">
        Save
      </v-btn>
      <v-btn @click="appStore.cancelPreset">
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
#main {
  background-color: lightblue;
  padding: 2rem;
}

#main h2 {
  color: #2b2b2b;
}

#footer {
  position: absolute;
  bottom: 2rem;
}

#footer>* {
  margin: 0.2rem;
}
</style>
