import {linkHorizontal} from "d3-shape";

function horizontalSource(d) {
  return [d.source.x + d.source.dx, d.source.y + d.sy + d.dy / 2];
}

function horizontalTarget(d) {
  return [d.target.x, d.target.y + d.ty + d.dy / 2];
}

export default function() {
  return linkHorizontal()
      .source(horizontalSource)
      .target(horizontalTarget);
}
