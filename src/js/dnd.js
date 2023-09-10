export function dragstart (event) {
  return false;
}

export function calcBorder (target) {
  // assumption: all borders are equal
  return (target.offsetWidth - target.clientWidth) / 2;
}

let dndActive = false;
export function isDnDActive () {
  return dndActive;
}

function moveAt (target, pos, offset) {
  const parentBox = target.parentElement.getBoundingClientRect();
  const parentBorder = calcBorder(target.parentElement);
  const relativeMousePosition = {
    left: pos.x - offset.x - parentBox.left,
    top: pos.y - offset.y - parentBox.top
  };
  target.style.left = `${Math.min(Math.max(relativeMousePosition.left, 0), parentBox.width - target.offsetWidth - parentBorder * 2)}px`;
  target.style.top = `${Math.min(Math.max(relativeMousePosition.top, 0), parentBox.height - target.offsetHeight - parentBorder * 2)}px`;
}

export function mouseDown (event) {
  dndActive = true;
  const { target: innerTarget, pageX, pageY, clientX, clientY } = event;
  const target = innerTarget.parentElement;
  const targetBox = target.getBoundingClientRect();
  const parentBorder = calcBorder(target.parentElement);

  const offset = {
    x: clientX - targetBox.left + parentBorder,
    y: clientY - targetBox.top + parentBorder
  };

  const pos = {
    x: pageX,
    y: pageY
  };

  moveAt(target, pos, offset);
  const boundMouseMove = mouseMove.bind(null, target, offset);
  document.addEventListener("mousemove", boundMouseMove);
  target.addEventListener("mouseup", mouseUp.bind(null, target, boundMouseMove), { once: true });
}

function mouseMove (target, offset, event) {
  const { pageX, pageY } = event;
  const pos = {
    x: pageX,
    y: pageY
  };
  moveAt(target, pos, offset);
}

function mouseUp (target, mouseMoveHandler, event) {
  dndActive = false;
  document.removeEventListener("mousemove", mouseMoveHandler);
  target.onmouseup = null;
}
