import * as d3 from "d3"

const drawGraph = (graph) => {
  const body = d3.select("body");
  const {width, height} = body.node().getBoundingClientRect();

  const svg = body.append("svg")
                  .attr("width", width)
                  .attr("height", height);

  const countries = body.append("div")
                        .style("width", width + "px")
                        .style("height", height + "px");

  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.index))
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
                  .attr("class", "links")
                  .selectAll("line")
                  .data(graph.links)
                .enter().append("line");

  const node = countries.selectAll(".flag")
                        .data(graph.nodes)
                        .enter().append("span")
                        .attr("class", d => "flag flag-" + d.code)
                        .attr("title", d => d.country)
                        .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended));

  simulation.nodes(graph.nodes).on("tick", ticked);
  simulation.force("link").links(graph.links);

  function ticked() {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.style("transform", d => "translate3d(" + d.x + "px, " + d.y + "px, 0) scale(.5, .5)");
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", (err, data) => {
  if(err) throw err;

  drawGraph(data);
});
