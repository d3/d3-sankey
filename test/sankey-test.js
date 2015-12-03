var tape = require("tape"),
  sankey = require("../");

// Hack to import values from graph.json without doing all sorts of crazy
// script-fu
var graph = {
  "nodes": [{
    "node": 0,
    "name": "node0"
  }, {
    "node": 1,
    "name": "node1"
  }, {
    "node": 2,
    "name": "node2"
  }, {
    "node": 3,
    "name": "node3"
  }, {
    "node": 4,
    "name": "node4"
  }],
  "links": [{
    "source": 0,
    "target": 2,
    "value": 2
  }, {
    "source": 1,
    "target": 2,
    "value": 2
  }, {
    "source": 1,
    "target": 3,
    "value": 2
  }, {
    "source": 0,
    "target": 4,
    "value": 2
  }, {
    "source": 2,
    "target": 3,
    "value": 2
  }, {
    "source": 2,
    "target": 4,
    "value": 2
  }, {
    "source": 3,
    "target": 4,
    "value": 4
  }]
}

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  width = 1200 - margin.left - margin.right,
  height = 740 - margin.top - margin.bottom;

var s = sankey.sankey()
  .nodeWidth(36)
  .nodePadding(10)
  .nodes(graph.nodes)
  .links(graph.links)
  .size([width, height])
  .layout(32);

tape("Testing nodeWidth", function(test) {
  test.plan(1);
  test.equal(s.nodeWidth(), 36);
  test.end();
});

tape("Testing nodePadding", function(test) {
  test.plan(1);
  test.equal(s.nodePadding(), 10);
  test.end();
});

tape("Testing nodes", function(test) {
  test.plan(1);

  var node_names = s.nodes().map(function(obj) {
    return obj.name
  });
  test.deepEqual(node_names, ['node0', 'node1', 'node2', 'node3', 'node4'])

  test.end();
});

tape("Testing links", function(test) {
  test.plan(1);

  var link_widths = s.links().map(function(obj) {
    return obj.dy
  });
  test.deepEqual(link_widths, [177.5, 177.5, 177.5, 177.5, 177.5, 177.5, 355])

  test.end();
});

tape("Testing size", function(test) {
  test.plan(1);
  test.deepEqual(s.size(), [1180, 720]);
  test.end();
});
