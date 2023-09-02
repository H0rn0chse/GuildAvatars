<script setup>
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

</script>

<template>
  <div id="main">
    <h2>ContentEditor</h2>
    <div id="footer">
      <v-btn @click="appStore.editPreset">
        Edit
      </v-btn>
      <v-btn @click="appStore.deletePreset">
        Delete
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
#main {
  background-color: lightseagreen;
  padding: 2rem;
  position: relative;
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
