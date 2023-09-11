<script setup>
import { useAppStore } from "@/store/app";
import { fitText } from "@/js/utils";
import { nextTick } from "vue";
import { watch } from "vue";
import { reactive } from "vue";
import { computed } from "vue";
import { ref } from "vue";

const avatarImage = ref(null);
const appStore = useAppStore();

const localImage = reactive({
  width: 0,
  height: 0
});

watch([avatarImage, appStore.currentPreset], async () => {
  await nextTick();
  localImage.width = avatarImage.value?.offsetWidth || 0;
  localImage.height = avatarImage.value?.offsetHeight || 0;
});

const fontSize = ref(0);
const localText = computed(() => {
  const source = appStore.currentPreset.textBox;

  const ratio = {
    x: localImage.width / source.ref.w,
    y: localImage.height / source.ref.h
  };

  return {
    x: source.x * ratio.y,
    y: source.y * ratio.y,
    w: source.w * ratio.x,
    h: source.h * ratio.y
  };
});

const avatarName = ref(null);
watch([localText, avatarName, avatarImage, appStore.currentPreset, appStore.contentEdit], async () => {
  const elem = avatarName.value;
  // wait for render
  if (elem && elem.clientWidth && elem.clientHeight) {
    const { fontSize: fittedFontSize } = fitText({
      text: appStore.contentEdit.text,
      width: localText.value.w,
      height: localText.value.h,
      font: appStore.currentPreset.font
    });

    fontSize.value = fittedFontSize;
  }
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
        ref="avatarName"
        :style="{
          'font-family': appStore.currentPreset.font,
          'font-size': fontSize,
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
  /* background-color: lightseagreen; */
  padding: 2rem;
  position: relative;
}

#main h2 {
  /* color: #2b2b2b; */
}

.image {
  width: 30rem;
  display: block;
}

#avatar {
  position: relative;
  width: min-content;
  overflow: hidden;
  margin: 1rem;
}

#avatarName {
  position: absolute;
  background-color: rgb(240, 128, 128, 0.5);
  text-align: center;
  border-radius: 5px;
  padding: 3px;
  display: flex;
  white-space: nowrap;
  line-height: normal;
  justify-content: center;
  align-items: center;
}

#footer {
  position: absolute;
  bottom: 2rem;
}

#footer>* {
  margin: 0.2rem;
}
</style>
