var tape = require("tape"),
    d3 = require("../");

tape("sankey(energy) returns the expected results", function(test) {
  var sankey = d3.sankey().nodeWidth(15).nodePadding(10).extent([[1, 1], [959, 494]]),
      energy = sankey(require("./energy"));
  test.deepEqual(energy.nodes.map(nodePosition), require("./energy-nodes"));
  test.deepEqual(energy.links.map(linkPosition), require("./energy-links"));
  test.end();
});

function nodePosition(node) {
  return {
    x: round(node.x),
    dx: round(node.dx),
    y: round(node.y),
    dy: round(node.dy)
  };
}

function linkPosition(link) {
  return {
    source: nodePosition(link.source),
    target: nodePosition(link.target),
    dy: round(link.dy),
    sy: round(link.sy),
    ty: round(link.ty)
  };
}

function round(x) {
  return Math.round(x * 10) / 10;
}
