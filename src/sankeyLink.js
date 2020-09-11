import {linkHorizontal, linkVertical} from "d3-shape";

function horizontalSource(d) {
  return [d.source.x1, d.y0];
}

function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}

export function sankeyLinkHorizontal() {
  return linkHorizontal()
      .source(horizontalSource)
      .target(horizontalTarget);
}

function verticalSource(d) {
  return [d.y0, d.source.y1];
}

function verticalTarget(d) {
  return [d.y1, d.target.y0];
}

export function sankeyLinkVertical() {
  return linkVertical()
      .source(verticalSource)
      .target(verticalTarget);
}
