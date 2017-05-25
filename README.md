# d3-sankey

Sankey diagrams visualize the directed flow between nodes in an acyclic network.

[<img alt="A possible scenario of UK energy production and consumption in 2050" src="https://raw.githubusercontent.com/d3/d3-sankey/master/img/energy.png" width="960" height="500">](https://bl.ocks.org/arankek/9ada4c74a87b57ae7308)

## Installing

If you use NPM, `npm install d3-sankey`. Otherwise, download the [latest release](https://github.com/d3/d3-sankey/releases/latest).

You can also load directly from unpkg.

```html
<script src="https://d3js.org/d3.v4.js"></script>
<script src="https://unpkg.com/d3-sankey@0"></script>
<script>

var sankey = d3.sankey();

</script>
```

## API Reference

<a href="#sankey" name="sankey">#</a> d3.<b>sankey</b>()

Constructs a new sankey generator with the default settings.

<a href="#_sankey" name="_sankey">#</a> <i>sankey</i>(…)

…

<a name="sankey_nodeWidth" href="#sankey_nodeWidth">#</a> <i>sankey</i>.<b>nodeWidth</b>([<i>width</i>])

If <i>width</i> is specified, sets the node width to the specified number and returns this sankey generator. If <i>width</i> is not specified, returns the current node width, which defaults to 24.

<a name="sankey_nodePadding" href="#sankey_nodePadding">#</a> <i>sankey</i>.<b>nodePadding</b>([<i>padding</i>])

If <i>padding</i> is specified, sets the vertical separation between nodes at each column to the specified number and returns this sankey generator. If <i>padding</i> is not specified, returns the current node padding, which defaults to 8.

<a name="sankey_size" href="#sankey_size">#</a> <i>sankey</i>.<b>size</b>([<i>size</i>])

If <i>size</i> is specified, sets the size of the layout to the specified two element array [*width*, *height*] and returns this sankey generator. If <i>size</i> is not specified, returns the current size, which defaults to [1, 1].

<a name="sankey_nodes" href="#sankey_nodes">#</a> <i>sankey</i>.<b>nodes</b>([<i>nodes</i>])

If <i>nodes</i> is specified, sets the sankey generator’s nodes to the specified array of objects and returns this sankey generator. If <i>nodes</i> is not specified, returns the current array of nodes, which defaults to the empty array. Each node must be an object. The following properties are assigned by the sankey generator when the layout is [generated](#_sankey):

* *node*.sourceLinks - the array of outgoing [links](#sankey_links) which have this node as their source
* *node*.targetLinks - the array of incoming [links](#sankey_links) which have this node as their target
* *node*.value - the node’s value; the sum of *link*.value for the node’s incoming [links](#sankey_links)
* *node*x - the node’s horizontal position (derived from the graph topology)
* *node*.dx - the node’s node width
* *node*.y - the node’s vertical position
* *node*.dy - the node’s height (proportional to its value)

See also [*sankey*.links](#sankey_links).

<a name="sankey_links" href="#sankey_links">#</a> <i>sankey</i>.<b>links</b>([<i>links</i>])

If <i>links</i> is specified, sets the sankey generator’s links to the specified array of objects and returns this sankey generator. If <i>links</i> is not specified, returns the current array of links, which defaults to the empty array. Each link is an object with the following properties:

* *link*.source - the link’s source [node](#sankey_nodes)
* *link*.target - the link’s target [node](#sankey_nodes)
* *link*.value - the link’s numeric value

For convenience, a link’s source and target may be initialized using the zero-based index of corresponding node in the array of nodes passed to the [sankey generator](#_sankey) rather than object references. The following properties are assigned to each link by the sankey generator when the layout is [generated](#_sankey):

* *link*.dy - the link’s breadth (proportional to its value)
* *link*.sy - the link’s vertical starting position (at source node)
* *link*.ty - the link’s vertical end position (at target node)

<a name="sankey_layout" href="#sankey_layout">#</a> <i>sankey</i>.<b>layout</b>(<i>iterations</i>)

Runs the sankey layout algorithm updating the [*sankey*.nodes](#sankey_nodes) and [*sankey*.links](#sankey_links) with their respective layout information and returns this sankey generator.

<i>iterations</i> is the number of passes to be used in the iterative relaxation algorithm for node placement.

<a name="sankey_relayout" href="#sankey_relayout">#</a> <i>sankey</i>.<b>relayout</b>()

Similar to <b>layout</b> but only recalculates the vertical positioning (depth) of links. This methods is primarily used when a node is moved vertically, e.g. using  **d3-drag**.

<a name="sankey_link" href="#sankey_link">#</a> <i>sankey</i>.<b>link</b>()

Returns a [link generator](#links) based on the calculated sankey layout.

### Links

<a name="_link" href="#_link">#</a> <i>link</i>(<i>link</i>)

The sankey link path generator can be invoked as a function being passed as its argument a link object with calculated layout information.

It returns the computed SVG path string for the link. By default the link path generator uses a curvature of 0.5.

<a name="link_curvature" href="#link_curvature">#</a> <i>link</i>.<b>curvature</b>([<i>curvature</i>])

If <i>curvature</i> is specified, sets the curvature to the specified number and returns this sankey link path generator. If <i>curvature</i> is not specified, returns the current curvature, which defaults to 0.5.
