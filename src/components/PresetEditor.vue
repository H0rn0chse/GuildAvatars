<script setup>
import { useAppStore } from "@/store/app";
import { ref, computed, reactive, watch, onMounted } from "vue";
import { dragstart, mouseDown, isDnDActive, calcBorder } from "@/js/dnd";
import { translateSize } from "../js/utils.js";

const appStore = useAppStore();

const dragEditEnabledLocal = computed({
  get () {
    return appStore.presetEditor.dragEditEnabled;
  },
  set (newValue) {
    appStore.setDragEditEnabled(!!newValue);
  }
});

const localData = reactive({
  textBox: {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
  },
  image: {
    w: 0,
    h: 0,
  },
  imageNatural: {
    w: 0,
    h: 0,
  },
});

// Initialize with preset data
onMounted(() => {
  const { w, h, x, y } = appStore.presetEdit.textBox;
  localData.textBox.w = w;
  localData.textBox.h = h;
  localData.textBox.x = x;
  localData.textBox.y = y;
});

/**
 * Temporary store for input values
 * Will be reset on switch back to drag mode
 */
const inputValues = new Map();
watch(dragEditEnabledLocal, () => {
  if (dragEditEnabledLocal.value) {
    inputValues.clear();
  }
});
function inputGetter (key) {
  // small to big
  const naturalBox = translateSize(localData.imageNatural, localData.textBox, localData.image);
  const naturalValue = naturalBox[key];
  if (dragEditEnabledLocal.value) {
    return Math.round(naturalValue);
  }
  return inputValues.get(key) || Math.round(naturalValue);
}

function inputSetter (key, newValue) {
  inputValues.set(key, newValue);
  // update big box
  const newNaturalBox = translateSize(localData.imageNatural, localData.textBox, localData.image);
  newNaturalBox[key] = parseInt(newValue, 10);
  // big to small
  const newBox = translateSize(localData.image, newNaturalBox, localData.imageNatural);
  localData.textBox[key] = newBox[key];
}

const inputWidth = computed({
  get () {
    return inputGetter("w");
  },
  set (newValue) {
    return inputSetter("w", newValue);
  }
});
const inputHeight = computed({
  get () {
    return inputGetter("h");
  },
  set (newValue) {
    return inputSetter("h", newValue);
  }
});
const inputTop = computed({
  get () {
    return inputGetter("y");
  },
  set (newValue) {
    return inputSetter("y", newValue);
  }
});
const inputLeft = computed({
  get () {
    return inputGetter("x");
  },
  set (newValue) {
    return inputSetter("x", newValue);
  }
});

let initialImage = true;
function applyBackground ([firstFile]) {
  if (!firstFile) {
    return;
  }
  const supportedFileEndings = [
    ".png",
    ".jpeg",
    ".jpg"
  ];
  const fileSupported = supportedFileEndings.some((ending) => firstFile.name.toLowerCase().endsWith(ending));
  if (!fileSupported) {
    alert("wrong filetype");
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    initialImage = false;
    // apply image
    appStore.presetEdit.image.src = event.target.result;
  };
  reader.readAsDataURL(firstFile);
}

const avatarImage = ref(null);
const textbox = ref(null);
watch(avatarImage, () => {
  avatarImage.value.addEventListener("load", () => {
    trackChanges();
    if (!initialImage) {
      resetBox();
      inputValues.clear();
    }
  });
});
function localSave () {
  const { textBox: presetTextBox, image: presetImage } = appStore.presetEdit;
  const { imageNatural, textBox, image } = getCurrentDimensions();

  presetTextBox.x = textBox.x;
  presetTextBox.y = textBox.y;
  presetTextBox.w = textBox.w;
  presetTextBox.h = textBox.h;

  // save current parent size w/o borders as reference
  presetTextBox.ref.w = image.w;
  presetTextBox.ref.h = image.h;
  // save target size
  presetImage.w = imageNatural.w;
  presetImage.h = imageNatural.h;
  appStore.savePreset();
}

function getCurrentDimensions () {
  const image = avatarImage.value;
  const target = textbox.value;

  return {
    textBox: {
      w: target?.offsetWidth || 100,
      h: target?.offsetHeight || 100,
      x: target?.offsetLeft || 0,
      y: target?.offsetTop || 0,
    },
    image: {
      w: target?.parentElement?.clientWidth || 0,
      h: target?.parentElement?.clientHeight || 0,
    },
    imageNatural: {
      w: image?.naturalWidth || 100,
      h: image?.naturalHeight || 100,
    },
  };
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

function trackChanges () {
  if (dragEditEnabledLocal.value) {
    restrictResize();
  }
  const { imageNatural, textBox, image } = getCurrentDimensions();
  localData.imageNatural = imageNatural;
  localData.textBox = textBox;
  localData.image = image;
}

function mouseDownLocal (event) {
  if (dragEditEnabledLocal.value) {
    mouseDown(event);
  }
}

function resetBox () {
  localData.textBox.w = 100;
  localData.textBox.h = 100;
  localData.textBox.x = 0;
  localData.textBox.y = 0;
}

</script>

<template>
  <div
    id="main"
    :class="dragEditEnabledLocal ? 'manualEditEnabled' : ''"
  >
    <h2>PresetEditor</h2>
    <v-text-field
      v-model="appStore.presetEdit.name"
      label="Preset Name"
    />
    <v-row>
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
          v-mutate.attr="trackChanges"
          :style="{
            'width': localData.textBox.w + 'px',
            'height': localData.textBox.h + 'px',
            'top': localData.textBox.y + 'px',
            'left': localData.textBox.x + 'px',
          }"
        >
          <div
            id="textBoxDnD"
            v-mutate.attr="trackChanges"
            @dragstart="dragstart"
            @mousedown="mouseDownLocal"
          />
        </div>
      </div>
      <v-col>
        <v-row>
          <v-checkbox
            v-model="dragEditEnabledLocal"
            title="Use Drag Edit"
            label="Use Drag Edit"
            :style="{flexGrow: 0, marginRight: '2rem' }"
          />
          <v-btn
            text="Reset Text Box"
            title="Reset Text Box"
            @click="resetBox"
          />
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="localData.imageNatural.w"
              label="Natural Width"
              title="Natural Width"
              type="number"
              disabled
            />
            <v-text-field
              v-model="localData.imageNatural.h"
              label="Natural Height"
              title="Natural Height"
              type="number"
              disabled
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="inputWidth"
              label="Box Width"
              title="Box Width"
              type="number"
              :readonly="dragEditEnabledLocal"
            />
            <v-text-field
              v-model="inputHeight"
              label="Box Height"
              title="Box Height"
              type="number"
              :readonly="dragEditEnabledLocal"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="inputTop"
              label="Offset Top"
              title="Offset Top"
              type="number"
              :readonly="dragEditEnabledLocal"
            />
            <v-text-field
              v-model="inputLeft"
              label="Offset Left"
              title="Offset Left"
              type="number"
              :readonly="dragEditEnabledLocal"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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
  height: min-content;
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
  border-radius: 3px;
}

.manualEditEnabled #textBoxResize {
  resize: both;
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
