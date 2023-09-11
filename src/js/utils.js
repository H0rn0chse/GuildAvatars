import * as textFit from "textfit";

export function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function fitText ({ text, width, height, font }) {
  const elem = document.createElement("div");
  elem.innerText = text;
  elem.style.width = `${width}px`;
  elem.style.height = `${height}px`;
  if (font) {
    elem.style.fontFamily = font;
  }

  // styling
  elem.style.position = "fixed";
  elem.style.top = `${-height}px`;
  elem.style.lineHeight = "normal";

  // debug
  const debug = false;
  if (debug) {
    elem.style.top = 0;
    elem.style.left = 0;
    elem.style.backgroundColor = "blue";
  }

  document.body.appendChild(elem);

  try {
    textFit(elem, {
      detectMultiLine: false,
      minFontSize: 0,
      maxFontSize: 50000,
      reProcess: true
    });
  } catch (err) {
    // console.error(err);
  }

  const target = elem.querySelector(".textFitted");
  const fontSize = target?.style?.fontSize;

  // cleanup
  if (!debug) {
    elem.remove();
  }


  return ({
    fontSize
  });
}
