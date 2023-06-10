<script setup>
import PresetSelection from "@/components/PresetSelection.vue";
import Editor from "@/components/Editor.vue";
</script>

<template>
  <v-app
    id="app"
    theme="dark"
    overflow-hidden
  >
    <v-main>
      <div id="gridContainer">
        <PresetSelection style="gridArea:presetSelection;" />
        <Editor style="gridArea:editor;" />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
#app,
#gridContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

#gridContainer {
  display: grid;
  grid-template-columns: 20rem auto;
  grid-template-rows: auto;
  grid-template-areas:
    "presetSelection editor";
}
</style>
