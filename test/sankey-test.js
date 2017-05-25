var tape = require("tape"),
    d3 = require("../");

tape("sankey(graph) returns the expected results", function(test) {
  var sankey = d3.sankey().nodeWidth(36).nodePadding(10).size([960, 500]),
      graph = sankey(require("./graph"));
  test.deepEqual(graph.nodes.map(nodePosition), []);
  test.deepEqual(graph.links.map(linkPosition), []);
  test.end();
});

function nodePosition(node) {
  return {
    x: node.x,
    dx: node.dx,
    y: node.y,
    dy: node.dy
  };
}

function linkPosition(link) {
  return {
    source: nodePosition(link.source),
    target: nodePosition(link.target),
    dy: link.dy,
    sy: link.sy,
    ty: link.ty
  };
}
