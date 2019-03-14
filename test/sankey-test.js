var tape = require("tape"),
    d3 = require("../");

tape.skip("sankey(energy) returns the expected results", function(test) {
  var sankey = d3.sankey().nodeWidth(15).nodePadding(10).extent([[1, 1], [959, 494]]),
      energy = sankey(require("./energy"));
  test.deepEqual(energy.nodes.map(nodePosition), require("./energy-nodes"));
  test.deepEqual(energy.links.map(linkPosition), require("./energy-links"));
  test.end();
});

function nodePosition(node) {
  return {
    x: round(node.x0),
    dx: round(node.x1 - node.x0),
    y: round(node.y0),
    dy: round(node.y1 - node.y0)
  };
}

function linkPosition(link) {
  return {
    source: nodePosition(link.source),
    target: nodePosition(link.target),
    dy: round(link.width),
    sy: round(link.y0 - link.source.y0 - link.width / 2),
    ty: round(link.y1 - link.target.y0 - link.width / 2)
  };
}

function round(x) {
  return Math.round(x * 10) / 10;
}
