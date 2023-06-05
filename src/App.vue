<script setup>
import Settings from "@/components/Settings.vue";
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
        <Settings style="gridArea:settings;" />
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
  grid-template-columns: min-content auto;
  grid-template-rows: auto;
  grid-template-areas:
    "settings editor";
}</style>
