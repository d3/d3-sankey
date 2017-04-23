# d3-sankey

D3 4.0 implementation of the Sankey plugin to visualize the flow between nodes in a directed acyclic network.

## Installing

If you use NPM, `npm install d3-sankey`. Otherwise, download the [latest release](https://github.com/d3/d3-sankey/releases/latest).

You can also load directly from unpkg.

```javascript
<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://unpkg.com/d3-sankey@0"></script>
<script>

var sankey = d3.sankey();

</script>
```

## Demo
Here is Mike Bostock's famous example [recreated with d3-sankey](http://bl.ocks.org/xaranke/9ada4c74a87b57ae7308).

Clone or download the block, then run `npm install` and `npm run build` to create `d3.min.js`.  

## API Reference

<a href="#sankey" name="sankey">#</a> <b>sankey</b>()

Constructs a new sankey generator with the default settings.

<a name="sankey_nodeWidth" href="#sankey_nodeWidth">#</a> <i>sankey</i>.<b>nodeWidth</b>([<i>width</i>])

If <i>width</i> is specified, sets the node width to the specified number and returns this sankey generator. If <i>width</i> is not specified, returns the current node width, which defaults to 24.

<a name="sankey_nodePadding" href="#sankey_nodePadding">#</a> <i>sankey</i>.<b>nodePadding</b>([<i>padding</i>])

If <i>padding</i> is specified, sets the node padding to the specified number and returns this sankey generator. If <i>padding</i> is not specified, returns the current node padding, which defaults to 8.

Here padding refers to the vertical space between nodes that occupy the same horizontal space.

<a name="sankey_size" href="#sankey_size">#</a> <i>sankey</i>.<b>size</b>([<i>size</i>])

If <i>size</i> is specified, sets the size of the sankey layout to the specified two element array [*width*, *height*] and returns this sankey generator. If <i>size</i> is not specified, returns the current layout size, which defaults to `[1, 1]`.

<a name="sankey_nodes" href="#sankey_nodes">#</a> <i>sankey</i>.<b>nodes</b>([<i>nodes</i>])

If <i>nodes</i> is specified, sets the sankey generator's nodes to the specified array of objects and returns this sankey generator. If <i>nodes</i> is not specified, returns the current array of nodes, which defaults to `[]`.

Each node must be an object. The following properties are assigned by the sankey generator when the `layout(...)` method is invoked:

* `sourceLinks` - array of links which have this node as their source; see [*sankey*.links](#sankey_links),
* `targetLinks` - array of links which have this node as their target; see [*sankey*.links](#sankey_links),
* `value` - numeric value of the node as calculated based on the `value` properties of its incident links; see [*sankey*.links](#sankey_links),
* `x` - node horizontal position,
* `dx` - node width,
* `y` - node vertical position (depth), and
* `dy` - node height (vertical extent based on node value).

<a name="sankey_links" href="#sankey_links">#</a> <i>sankey</i>.<b>links</b>([<i>links</i>])

If <i>links</i> is specified, sets the sankey generator's links to the specified array of objects and returns this sankey generator. If <i>links</i> is not specified, returns the current array of links, which defaults to `[]`.

Each link is an object with the following properties:

* `source` - the link's source node; see [*sankey*.nodes](#sankey_nodes),
* `target` - the link's target node; see [*sankey*.nodes](#sankey_nodes), and
* `value` - the link's numeric value.

For convenience, a link’s `source` and `target` properties may be initialized using the index of corresponding node in the array of nodes passed into the sankey generator rather than object references.

The following properties are assigned to each link by the sankey generator when the `layout(...)` method is invoked:

* `dy` - link breadth calculated based on the link value,
* `sy` - vertical starting position of the link (at source node), and
* `ty` - vertical end position of the link (at target node).

<a name="sankey_layout" href="#sankey_layout">#</a> <i>sankey</i>.<b>layout</b>(<i>iterations</i>)

Runs the sankey layout algorithm updating the [*sankey*.nodes](#sankey_nodes) and [*sankey*.links](#sankey_links) with their respective layout information and returns this sankey generator.
<i>iterations</i> is the number of passes to be used in the iterative relaxation algorithm for node placement.

<a name="sankey_relayout" href="#sankey_relayout">#</a> <i>sankey</i>.<b>relayout</b>()

Similar to <b>layout</b> but only recalculates the vertical positioning (depth) of links. This methods is primarily used when a node is moved vertically, e.g. using  **d3-drag**.

<a name="sankey_link" href="#sankey_link">#</a> <i>sankey</i>.<b>link</b>()

Returns a [*SankeyLinkPathGenerator*](#sankey_path_gen) based on the calculated sankey layout.

<a name="sankey_path_gen" href="#sankey_path_gen">#</a> <i>SankeyLinkPathGenerator</i>(<i>link</i>)

The sankey link path generator can be invoked as a function being passed as its argument a link object with calculated layout information.
It returns the computed `<svg>` path string for the link. By default the link path generator uses a curvature of 0.5.

<a name="sankey_path_gen_curvature" href="#sankey_path_gen_curvature">#</a> <i>SankeyLinkPathGenerator</i>.<b>curvature</b>([<i>curvature</i>])

If <i>curvature</i> is specified, sets the curvature to the specified number and returns this sankey link path generator. If <i>curvature</i> is not specified, returns the current curvature, which defaults to 0.5.

