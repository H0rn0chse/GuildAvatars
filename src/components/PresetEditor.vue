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
    // Reset text box
    appStore.presetEdit.textBox.x = 0;
    appStore.presetEdit.textBox.y = 0;
    appStore.presetEdit.textBox.w = 100;
    appStore.presetEdit.textBox.h = 100;
    // apply image
    appStore.presetEdit.image.src = event.target.result;
  };
  reader.readAsDataURL(firstFile);
}

const avatarImage = ref(null);
const textbox = ref(null);
function localSave () {
  const image = avatarImage.value;
  const target = textbox.value;
  appStore.presetEdit.textBox.x = target?.offsetLeft || 0;
  appStore.presetEdit.textBox.y = target?.offsetTop || 0;
  appStore.presetEdit.textBox.w = target?.offsetWidth || 100;
  appStore.presetEdit.textBox.h = target?.offsetHeight || 100;

  // save current parent size w/o borders as reference
  appStore.presetEdit.textBox.ref.w = target?.parentElement?.clientWidth || 0;
  appStore.presetEdit.textBox.ref.h = target?.parentElement?.clientHeight || 0;
  // save target size
  appStore.presetEdit.image.w = image?.naturalWidth || 100;
  appStore.presetEdit.image.h = image?.naturalHeight || 100;
  appStore.savePreset();
}

function restrictResize () {
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
      v-if="appStore.presetEdit.image.src"
      id="imageEditor"
      class="noSelect"
    >
      <img
        ref="avatarImage"
        class="image"
        :src="appStore.presetEdit.image.src"
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
      <div
        class="colorPicker"
        :style="{ backgroundColor: appStore.presetEdit.fontColor }"
      >
        <v-menu
          activator="parent"
          :close-on-content-click="false"
          close-delay="500"
          open-on-hover
        >
          <v-color-picker
            v-model="appStore.presetEdit.fontColor"
            :hide-canvas="false"
            :hide-sliders="false"
            mode="rgb"
            :modes="['rgb']"
          />
        </v-menu>
      </div>
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
  padding: 2rem;
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

.colorPicker {
  margin-right: 0.5em;
  width: 2em;
  height: 2em;
  border-width: 2px;
  border-radius: 5px;
  cursor: pointer;
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
