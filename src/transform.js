export function transformTop(x0, y0, x1, y1) {
  return {x0: y0, y0: x0, x1: y1, y1: x1};
}

export function transformRight(x0, y0, x1, y1) {
  return {x0: x0, y0: y0, x1: x1, y1: y1};
}

export function transformBottom(x0, y0, x1, y1) {
  return {x0: y0, y0: x1, x1: y1, y1: x0};
}

export function transformLeft(x0, y0, x1, y1) {
  return {x0: x1, y0: y0, x1: x0, y1: y1};
}
