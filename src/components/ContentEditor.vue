<script setup>
import { useAppStore } from "@/store/app";
import { fitText, exportImage, translateSize } from "@/js/utils";
import { nextTick, watch, reactive, computed, ref } from "vue";

const appStore = useAppStore();

const localImage = reactive({
  width: 0,
  height: 0
});

const avatarImage = ref(null);
watch([avatarImage, appStore.currentPreset], async () => {
  await nextTick();
  localImage.width = avatarImage.value?.offsetWidth || 0;
  localImage.height = avatarImage.value?.offsetHeight || 0;
});

const fontSize = ref(0);
const localText = computed(() => {
  const source = appStore.currentPreset.textBox;
  const target = {
    w: localImage.width,
    h: localImage.height
  };

  return translateSize(target, source, source.ref);
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

async function exportImageLocal () {
  const preset = appStore.currentPreset;
  const dataUrl = await exportImage({
    text: appStore.contentEdit.text,
    textBox: preset.textBox,
    image: preset.image,
    font: preset.font,
    fontColor: preset.fontColor
  });
  appStore.contentEdit.dataUrl = dataUrl;
}

</script>

<template>
  <div id="main">
    <h2>ContentEditor - {{ appStore.currentPreset?.name }}</h2>
    <div
      v-if="appStore.currentPreset.image.src"
      id="avatar"
    >
      <img
        ref="avatarImage"
        class="image"
        :src="appStore.currentPreset.image.src"
      >
      <div
        id="avatarName"
        ref="avatarName"
        :style="{
          'font-size': fontSize,
          'font-family': appStore.currentPreset.font,
          'color': appStore.currentPreset.fontColor,
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
      <v-btn
        style="margin-left: 7rem;"
        @click="appStore.deletePreset"
      >
        Delete
      </v-btn>
      <v-btn @click="exportImageLocal">
        Export
      </v-btn>
      <img
        v-if="appStore.contentEdit.dataUrl"
        :src="appStore.contentEdit.dataUrl"
        width="50"
      >
    </div>
  </div>
</template>

<style scoped>
#main {
  padding: 2rem;
  position: relative;
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
  /* background-color: rgb(240, 128, 128, 0.5); */
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
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 2rem;
}

#footer>* {
  margin: 0.2rem;
}
</style>
