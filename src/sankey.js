import {ascending, min, sum} from "d3-array";
import {map, nest} from "d3-collection";
import {justify} from "./align.js";
import constant from "./constant.js";

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function defaultId(d) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  var node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}

export default function Sankey() {
  var x0 = 0, y0 = 0, x1 = 1, y1 = 1, // extent
      dx = 24, // nodeWidth
      py = 8, // nodePadding
      id = defaultId,
      align = justify,
      sort,
      linkSort,
      nodes = defaultNodes,
      links = defaultLinks,
      iterations = 6;

  function sankey() {
    var graph = {nodes: nodes.apply(null, arguments), links: links.apply(null, arguments)};
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeBreadths(graph);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function(_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant(_), sankey) : id;
  };

  sankey.nodeAlign = function(_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant(_), sankey) : align;
  };

  sankey.nodeSort = function(_) {
    return arguments.length ? (sort = _, sankey) : sort;
  };

  sankey.nodeWidth = function(_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };

  sankey.nodePadding = function(_) {
    return arguments.length ? (py = +_, sankey) : py;
  };

  sankey.nodes = function(_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant(_), sankey) : nodes;
  };

  sankey.links = function(_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant(_), sankey) : links;
  };

  sankey.linkSort = function(_) {
    return arguments.length ? (linkSort = _, sankey) : linkSort;
  };

  sankey.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks(graph) {
    graph.nodes.forEach(function(node, i) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    var nodeById = map(graph.nodes, id);
    graph.links.forEach(function(link, i) {
      link.index = i;
      var source = link.source, target = link.target;
      if (typeof source !== "object") source = link.source = find(nodeById, source);
      if (typeof target !== "object") target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues(graph) {
    graph.nodes.forEach(function(node) {
      node.value = Math.max(
        sum(node.sourceLinks, value),
        sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the depth (x-position) for each node.
  // Nodes are assigned the maximum depth of incoming neighbors plus one;
  // nodes with no incoming links are assigned depth zero, while
  // nodes with no outgoing links are assigned the maximum depth.
  function computeNodeDepths(graph) {
    var nodes, next, x, n = graph.nodes.length;

    for (nodes = graph.nodes, next = [], x = 0; nodes.length; ++x, nodes = next, next = []) {
      if (x > n) throw new Error("circular link");
      nodes.forEach(function(node) {
        node.depth = x;
        node.sourceLinks.forEach(function(link) {
          if (next.indexOf(link.target) < 0) {
            next.push(link.target);
          }
        });
      });
    }

    for (nodes = graph.nodes, next = [], x = 0; nodes.length; ++x, nodes = next, next = []) {
      if (x > n) throw new Error("circular link");
      nodes.forEach(function(node) {
        node.height = x;
        node.targetLinks.forEach(function(link) {
          if (next.indexOf(link.source) < 0) {
            next.push(link.source);
          }
        });
      });
    }

    var kx = (x1 - x0 - dx) / (x - 1);
    graph.nodes.forEach(function(node) {
      node.layer = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
      node.x1 = (node.x0 = x0 + node.layer * kx) + dx;
    });
  }

  function computeNodeBreadths(graph) {
    var columns = nest()
        .key(function(d) { return d.x0; })
        .sortKeys(ascending)
        .entries(graph.nodes)
        .map(function(d) { return d.values; });

    //
    initializeNodeBreadth();
    for (var i = 0, n = iterations; i < n; ++i) {
      const a = Math.pow(0.99, i);
      const b = (i + 1) / n;
      reorderLinks(graph);
      relaxRightToLeft(a);
      resolveCollisionsTopToBottom(b);
      resolveCollisionsBottomToTop(b);
      reorderLinks(graph);
      relaxLeftToRight(a);
      resolveCollisionsTopToBottom(b);
      resolveCollisionsBottomToTop(b);
    }

    function initializeNodeBreadth() {
      var ky = min(columns, function(nodes) {
        return (y1 - y0 - (nodes.length - 1) * py) / sum(nodes, value);
      });

      columns.forEach(function(nodes) {
        if (sort != null) nodes.sort(sort);
        let y = y0;
        nodes.forEach(function(node) {
          node.y0 = y;
          node.y1 = y + node.value * ky;
          y = node.y1 + py;
        });
      });

      graph.links.forEach(function(link) {
        link.width = link.value * ky;
      });

      if (linkSort != null) graph.nodes.forEach(function(node) {
        node.sourceLinks.sort(linkSort);
        node.targetLinks.sort(linkSort);
      });
    }

    // Reposition each node based on its incoming (target) links.
    function relaxLeftToRight(alpha) {
      columns.slice(1).forEach(function(nodes) {
        nodes.forEach(function(target) {
          let y = 0;
          let w = 0;
          for (const {source, value} of target.targetLinks) {
            let v = value * (target.layer - source.layer);
            y += targetTop(source, target) * v;
            w += v;
          }
          if (!(w > 0)) return;
          let dy = (y / w - target.y0) * alpha;
          target.y0 += dy;
          target.y1 += dy;
        });
      });
    }

    // Reposition each node based on its outgoing (source) links.
    function relaxRightToLeft(alpha) {
      columns.slice(0, -1).reverse().forEach(function(nodes) {
        nodes.forEach(function(source) {
          let y = 0;
          let w = 0;
          for (const {target, value} of source.sourceLinks) {
            let v = value * (target.layer - source.layer);
            y += sourceTop(source, target) * v;
            w += v;
          }
          if (!(w > 0)) return;
          let dy = (y / w - source.y0) * alpha;
          source.y0 += dy;
          source.y1 += dy;
        });
      });
    }

    // Push any overlapping nodes down.
    function resolveCollisionsTopToBottom(alpha) {
      columns.forEach(function(nodes) {
        var node,
            dy,
            y = y0,
            n = nodes.length,
            i;
        if (sort === undefined) nodes.sort(ascendingBreadth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = (y - node.y0) * alpha;
          if (dy > 1e-6) node.y0 += dy, node.y1 += dy;
          y = node.y1 + py;
        }
      });
    }

    // Push any overlapping nodes up.
    function resolveCollisionsBottomToTop(alpha) {
      columns.forEach(function(nodes) {
        var node,
            dy,
            y = y1,
            n = nodes.length,
            i;
        if (sort === undefined) nodes.sort(ascendingBreadth);
        for (i = n - 1; i >= 0; --i) {
          node = nodes[i];
          dy = (node.y1 - y) * alpha;
          if (dy > 1e-6) node.y0 -= dy, node.y1 -= dy;
          y = node.y0 - py;
        }
      });
    }
  }

  function reorderLinks(graph) {
    if (linkSort === undefined) graph.nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetBreadth);
      node.targetLinks.sort(ascendingSourceBreadth);
    });
  }

  function computeLinkBreadths(graph) {
    reorderLinks(graph);
    graph.nodes.forEach(function(node) {
      var y0 = node.y0, y1 = y0;
      node.sourceLinks.forEach(function(link) {
        link.y0 = y0 + link.width / 2, y0 += link.width;
      });
      node.targetLinks.forEach(function(link) {
        link.y1 = y1 + link.width / 2, y1 += link.width;
      });
    });
  }

  // Returns the target.y0 that would produce an ideal link from source to target.
  function targetTop(source, target) {
    let y = source.y0 - (source.sourceLinks.length - 1) * py / 2;
    for (const {target: node, width} of source.sourceLinks) {
      if (node === target) break;
      y += width + py;
    }
    for (const {source: node, width} of target.targetLinks) {
      if (node === source) break;
      y -= width;
    }
    return y;
  }

  // Returns the source.y0 that would produce an ideal link from source to target.
  function sourceTop(source, target) {
    let y = target.y0 - (target.targetLinks.length - 1) * py / 2;
    for (const {source: node, width} of target.targetLinks) {
      if (node === source) break;
      y += width + py;
    }
    for (const {target: node, width} of source.sourceLinks) {
      if (node === target) break;
      y -= width;
    }
    return y;
  }

  return sankey;
}
