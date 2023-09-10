<script setup>
import { useAppStore } from "@/store/app";
import { computed } from "vue";
import { ref } from "vue";

const avatarImage = ref(null);
const appStore = useAppStore();

const localText = computed(() => {
  /*if (!avatarImage.value) {
    return {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    };
  }*/
  //todo: use dynamic size
  const imageWidth = 480; //avatarImage.value.offsetWidth;
  const imageHeight = 480; //avatarImage.value.offsetHeight;

  const source = appStore.currentPreset.textBox;

  const ratio = {
    x: imageWidth / source.ref.w,
    y: imageHeight / source.ref.h
  };

  return {
    x: source.x * ratio.y,
    y: source.y * ratio.y,
    w: source.w * ratio.x,
    h: source.h * ratio.y
  };
});

function exportImage () {
  console.error("EXPORT");
}

</script>

<template>
  <div id="main">
    <h2>ContentEditor - {{ appStore.currentPreset?.name }}</h2>
    <div
      v-if="appStore.currentPreset.imageSrc"
      id="avatar"
    >
      <img
        ref="avatarImage"
        class="image"
        :src="appStore.currentPreset.imageSrc"
      >
      <div
        id="avatarName"
        :style="{
          'font-family': appStore.currentPreset.font,
          'width': localText.w + 'px',
          'height': localText.h + 'px',
          'top': localText.y + 'px',
          'left': localText.x + 'px',
        }"
      >
        {{ appStore.contentEdit.text }}
      </div>
    </div>
    <v-text-field
      v-model="appStore.contentEdit.text"
      label="Text"
    />
    <div id="footer">
      <v-btn @click="appStore.editPreset">
        Edit
      </v-btn>
      <v-btn @click="appStore.deletePreset">
        Delete
      </v-btn>
      <v-btn @click="exportImage">
        Export
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

.image {
  width: 30rem;
  display: block;
}

#avatar {
  position: relative;
  width: min-content;
  overflow: hidden;
}

#avatarName {
  position: absolute;
  background-color: rgb(255, 0, 0, 0.5);
  text-align: center;
  border-radius: 5px;
  padding: 3px;
}

#footer {
  position: absolute;
  bottom: 2rem;
}

#footer>* {
  margin: 0.2rem;
}
</style>
