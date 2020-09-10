export function orientUp(x0, y0, x1, y1) {
  return {x0: y0, y0: x1, x1: y1, y1: x0};
}

export function orientDown(x0, y0, x1, y1) {
  return {x0: y0, y0: x0, x1: y1, y1: x1};
}

export function orientLeft(x0, y0, x1, y1) {
  return {x0: x1, y0: y0, x1: x0, y1: y1};
}

export function orientRight(x0, y0, x1, y1) {
  return {x0: x0, y0: y0, x1: x1, y1: y1};
}
