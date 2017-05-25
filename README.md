# d3-sankey

Sankey diagrams visualize the directed flow between nodes in an acyclic network.

[<img alt="A possible scenario of UK energy production and consumption in 2050" src="https://raw.githubusercontent.com/d3/d3-sankey/master/img/energy.png" width="960" height="500">](https://bl.ocks.org/arankek/9ada4c74a87b57ae7308)

## Installing

If you use NPM, `npm install d3-sankey`. Otherwise, download the [latest release](https://github.com/d3/d3-sankey/releases/latest).

You can also load directly from unpkg.

```html
<script src="https://unpkg.com/d3-array@1"></script>
<script src="https://unpkg.com/d3-collection@1"></script>
<script src="https://unpkg.com/d3-path@0"></script>
<script src="https://unpkg.com/d3-shape@0"></script>
<script src="https://unpkg.com/d3-sankey@0"></script>
<script>

var sankey = d3.sankey();

</script>
```

## API Reference

<a href="#sankey" name="sankey">#</a> d3.<b>sankey</b>()

Constructs a new Sankey generator with the default settings.

<a href="#_sankey" name="_sankey">#</a> <i>sankey</i>(<i>graph</i>)

…

<a name="sankey_nodes" href="#sankey_nodes">#</a> <i>sankey</i>.<b>nodes</b>([<i>nodes</i>])

If <i>nodes</i> is specified, sets the Sankey generator’s nodes to the specified array of objects and returns this Sankey generator. If <i>nodes</i> is not specified, returns the current array of nodes, which defaults to the empty array. Each node must be an object. The following properties are assigned by the Sankey generator when the layout is [generated](#_sankey):

* *node*.sourceLinks - the array of outgoing [links](#sankey_links) which have this node as their source
* *node*.targetLinks - the array of incoming [links](#sankey_links) which have this node as their target
* *node*.value - the node’s value; the sum of *link*.value for the node’s incoming [links](#sankey_links)
* *node*x - the node’s horizontal position (derived from the graph topology)
* *node*.dx - the node’s node width
* *node*.y - the node’s vertical position
* *node*.dy - the node’s height (proportional to its value)

See also [*sankey*.links](#sankey_links).

<a name="sankey_links" href="#sankey_links">#</a> <i>sankey</i>.<b>links</b>([<i>links</i>])

If <i>links</i> is specified, sets the Sankey generator’s links to the specified array of objects and returns this Sankey generator. If <i>links</i> is not specified, returns the current array of links, which defaults to the empty array. Each link is an object with the following properties:

* *link*.source - the link’s source [node](#sankey_nodes)
* *link*.target - the link’s target [node](#sankey_nodes)
* *link*.value - the link’s numeric value

For convenience, a link’s source and target may be initialized using the zero-based index of corresponding node in the array of nodes passed to the [Sankey generator](#_sankey) rather than object references. The following properties are assigned to each link by the Sankey generator when the layout is [generated](#_sankey):

* *link*.dy - the link’s breadth (proportional to its value)
* *link*.sy - the link’s vertical starting position (at source node)
* *link*.ty - the link’s vertical end position (at target node)

<a name="sankey_nodeWidth" href="#sankey_nodeWidth">#</a> <i>sankey</i>.<b>nodeWidth</b>([<i>width</i>])

If <i>width</i> is specified, sets the node width to the specified number and returns this Sankey generator. If <i>width</i> is not specified, returns the current node width, which defaults to 24.

<a name="sankey_nodePadding" href="#sankey_nodePadding">#</a> <i>sankey</i>.<b>nodePadding</b>([<i>padding</i>])

If <i>padding</i> is specified, sets the vertical separation between nodes at each column to the specified number and returns this Sankey generator. If <i>padding</i> is not specified, returns the current node padding, which defaults to 8.

<a name="sankey_extent" href="#sankey_extent">#</a> <i>sankey</i>.<b>extent</b>([<i>extent</i>])

If *extent* is specified, sets the extent of the Sankey layout to the specified bounds and returns the layout. The *extent* bounds are specified as an array \[\[<i>x0</i>, <i>y0</i>\], \[<i>x1</i>, <i>y1</i>\]\], where <i>x0</i> is the left side of the extent, <i>y0</i> is the top, <i>x1</i> is the right and <i>y1</i> is the bottom. If *extent* is not specified, returns the current extent which defaults to null.

<a name="sankey_size" href="#sankey_size">#</a> <i>sankey</i>.<b>size</b>([<i>size</i>])

An alias for [*sankey*.extent](#sankey_extent) where the minimum *x* and *y* of the extent are ⟨0,0⟩. Equivalent to:

```js
sankey.extent([[0, 0], size]);
```

<a name="sankey_iterations" href="#sankey_iterations">#</a> <i>sankey</i>.<b>iterations</b>([<i>iterations</i>])

If *iterations* is specified, sets the number of relaxation iterations when [generating the layout](#_sankey) and returns this Sankey generator. If *iterations* is not specified, returns the current number of relaxation iterations, which defaults to 32.

### Links

<a name="sankeyLinkHorizontal" href="#sankeyLinkHorizontal">#</a> d3.<i>sankeyLinkHorizontal</i>()

Returns a [horizontal link shape](https://github.com/d3/d3-shape/blob/master/README.md#linkHorizontal) suitable for a Sankey diagram. The source and target accessors are defined as follows:

```js
function source(d) {
  return [d.source.x + d.source.dx, d.source.y + d.sy + d.dy / 2];
}

function target(d) {
  return [d.target.x, d.target.y + d.ty + d.dy / 2];
}
```

For example, to render the links of a Sankey diagram in SVG, you might say:

```js
svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
  .selectAll("path")
  .data(graph.links)
  .enter().append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", function(d) { return d.dy; });
```
