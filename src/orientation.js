export function orientDown(x0, y0, x1, y1) {
  return {x0: y0, y0: x0, x1: y1, y1: x1};
}

export function orientRight(x0, y0, x1, y1) {
  return {x0: x0, y0: y0, x1: x1, y1: y1};
}
