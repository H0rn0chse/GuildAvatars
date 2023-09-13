<script setup>
import { useAppStore } from "@/store/app";
import { dragstart, mouseDown, isDnDActive, calcBorder } from "@/js/dnd";
import { ref } from "vue";

const appStore = useAppStore();

function applyBackground ([firstFile]) {
  if (!firstFile) {
    return;
  }
  const supportedFileEndings = [
    ".png",
    ".jpeg",
    ".jpg"
  ];
  const fileSupported = supportedFileEndings.some((ending) => firstFile.name.endsWith(ending));
  if (!fileSupported) {
    alert("wrong filetype");
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    appStore.presetEdit.imageSrc = event.target.result;
  };
  reader.readAsDataURL(firstFile);
}

const textbox = ref(null);
function localSave () {
  const target = textbox.value;
  appStore.presetEdit.textBox.x = target?.offsetLeft || 0;
  appStore.presetEdit.textBox.y = target?.offsetTop || 0;
  appStore.presetEdit.textBox.w = target?.offsetWidth || 100;
  appStore.presetEdit.textBox.h = target?.offsetHeight || 100;

  // save current parent size w/o borders as reference
  appStore.presetEdit.textBox.ref.w = target?.parentElement?.clientWidth || 0;
  appStore.presetEdit.textBox.ref.h = target?.parentElement?.clientHeight || 0;
  appStore.savePreset();
}

function restrictResize (mutationRecords, mutationObserver) {
  if (isDnDActive()) {
    return; // dnd is already handled differently
  }
  const target = textbox.value;
  const parentBox = target.parentElement.getBoundingClientRect();
  const parentBorder = calcBorder(target.parentElement);
  const width = Math.min(target.offsetWidth, parentBox.width - target.offsetLeft - parentBorder * 2);
  const height = Math.min(target.offsetHeight, parentBox.height - target.offsetTop - parentBorder * 2);
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;
}

</script>

<template>
  <div id="main">
    <h2>PresetEditor</h2>
    <v-text-field
      v-model="appStore.presetEdit.name"
      label="Preset Name"
    />
    <div
      v-if="appStore.presetEdit.imageSrc"
      id="imageEditor"
      class="noSelect"
    >
      <img
        class="image"
        :src="appStore.presetEdit.imageSrc"
      >
      <div
        id="textBoxResize"
        ref="textbox"
        v-mutate.attr="restrictResize"
        :style="{
          'width': appStore.presetEdit.textBox.w + 'px',
          'height': appStore.presetEdit.textBox.h + 'px',
          'top': appStore.presetEdit.textBox.y + 'px',
          'left': appStore.presetEdit.textBox.x + 'px',
        }"
      >
        <div
          id="textBoxDnD"
          @dragstart="dragstart"
          @mousedown="mouseDown"
        />
      </div>
    </div>
    <v-file-input
      class="imageSelector"
      label="Image"
      accept="image/png, image/jpeg"
      @update:model-value="applyBackground"
    />
    <v-row id="fontEditor">
      <p :style="{ 'font-family': appStore.presetEdit.font }">
        Lorem ipsum dolor sit amet
      </p>
      <v-text-field
        v-model="appStore.presetEdit.font"
        label="Font"
      />
    </v-row>
    <div id="footer">
      <v-btn @click="localSave">
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
  /* background-color: lightblue; */
  padding: 2rem;
}

#main h2 {
  /* color: #2b2b2b; */
}

#imageEditor {
  position: relative;
  border: solid #2b2b2b 2px;
  border-radius: 5px;
  width: min-content;
  overflow: hidden;
}

.image {
  width: 20rem;
  display: block;
}

#textBoxResize {
  position: absolute;
  background-color: rgb(240, 128, 128, 0.5);
  overflow: auto;
  resize: both;
  border-radius: 3px;
}

#textBoxDnD {
  width: 100%;
  height: 100%;
}

.imageSelector {
  margin: 1rem;
}

#fontEditor {
  align-items: center;
}

#fontEditor>* {
  margin: 1rem;
}

#footer {
  position: absolute;
  bottom: 2rem;
}

#footer>* {
  margin: 0.2rem;
}

.noSelect {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Old versions of Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
</style>
