var data = [
	{ w: 106.7, d: '20130803' },
	{ w: 106.5, d: '20130804' },
	{ w: 106.0, d: '20130805' },	
	{ w: 105.8, d: '20130806' },	
];

if(Meteor.isClient) {
	Template.weightGraph.rendered = function() {	
		var self = this;
		self.node = self.find("#svgArea");
		var height = 200;

		var margin = {top: 0, right: 0, bottom: 0, left: 0},
    	width = 200,
    	height = 200;

		var parseDate = d3.time.format("%Y%m%d").parse;

		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var area = d3.svg.area()
		    .x(function(d) { return x(d.d); })
		    .y0(height)
		    .y1(function(d) { return y(d.w); });

		var svg = d3.select("#svgArea")
		  	.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain(d3.extent(data, function(d) { return d.d; }));
		y.domain([105, d3.max(data, function(d) { return d.w; })]);

		svg.append("path")
			.datum(data)
			.attr("class", "area")
			.attr("d", area);

		/*svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Price ($)");*/

		/*if(!self.drawGraph) {
			self.drawGraph = Deps.autorun(function(){

			});
		}*/
	}	
}