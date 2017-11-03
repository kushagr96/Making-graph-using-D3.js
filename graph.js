//setting the width and height
var width = 960,
    height = 600;

//initializing the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//initializing the color
var fill = d3.scaleOrdinal(d3.schemeCategory10);

//initializing the force element
var force_simul = d3.forceSimulation()
	.force('link', d3.forceLink()
					.id(function(d){ return d.id; })
					.distance(300)
	)
	.force('center', d3.forceCenter(width / 2, height / 2 - 50))
	.force('charge', d3.forceManyBody().strength(-200))
	.force('collision', d3.forceCollide());

//calling the data from json file
d3.json('graph.json', function(error, data) {
	
	//error handing
	if(error) throw error;

	//initializing the nodes and links
	var nodes = data.nodes,
		links = data.links;

	//setting the graph nodes	
	var graph = svg.selectAll('g')
					.data(nodes)
					.enter().append('g')
					.attr('class', 'graph');

	//adding text to the nodes				
	graph.append('text')
		.text(function(d) { return d.id; })
		.style('fill', function(d) { return fill(d.group * 2); }); 

	//making node as a rectangle
	graph.append('rect')
		.attr('width', function(d) { return 15 * d.chart.length + 5; })
		.attr('height', 110)
		.style('fill-opacity', 0)
		.style('stroke-width', 4)
		.style('stroke', function(d) { return fill(d.group * 2); });

	//making the bar chart in each node	
	graph.selectAll('g')
		.data(function(d) { return d.chart; })
		.enter().append('g')
		.attr('transform', function(d,i) { return 'translate(' + (i * 15 + 5) + ',' + (100 - d.percent + 5) + ')';})
		.append('rect')
		.style('fill', function(d) { return fill(d.color);})
		.attr('width', 10)
		.attr('height', function(d) { return d.percent; });	

	//setting the graph links	
	var link = svg.append('g')
					.style("stroke", "#aaa")
					.attr('class', 'links')
					.selectAll('line')
					.data(links)
					.enter().append('line')
					.attr('stroke-width', function(d){ return d.value/3; });

	//adding tick event				
	force_simul.nodes(nodes)
				.on('tick', function() {
					link
						.attr('x1', function(d) { return d.source.x; })
						.attr('y1', function(d) { return d.source.y; })
						.attr('x2', function(d) { return d.target.x; })
						.attr('y2', function(d) { return d.target.y; });

					graph
						.attr('transform', function(d) { return 'translate('+ d.x + ',' + d.y +')'; });
				});

	//adding links to force			
	force_simul.force('link')
				.links(links);

});				