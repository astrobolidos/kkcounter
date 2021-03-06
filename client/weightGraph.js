if(Meteor.isClient) {
	Template.weightGraph.rendered = function() {	
		var self = this;
		console.log(self.parent);
		self.node = self.find("#svgArea");

		if(!self.drawGraph) {
			self.drawGraph = Deps.autorun(function(){
				Session.get('touch'); // reactive to windows resize

				var info = DailyCalories.find({weight: {$exists: true }}, {sort: {date: 1}}).fetch();

				var margin = {top: 0, right: 0, bottom: 0, left: 0},
		    	width = self.firstNode.clientWidth;
		    	height = 100;

				var parseDate = d3.time.format("%Y%m%d").parse;

				var x = d3.time.scale().range([0, width]);
				x.domain(d3.extent(info, function(d) { return parseDate(d.date); }));			
				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("top");
				
				var y = d3.scale.linear().range([height, 0]);
				y.domain([
					d3.min(info, function(d) { return d.weight; }) - 0.3, 
					d3.max(info, function(d) { return d.weight; })
				]);				
				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("right");

				var area = d3.svg.area()
				    .x(function(d) { return x(parseDate(d.date)); })
				    .y0(height)
				    .y1(function(d) { return y(d.weight); });

				var svg = d3.select("#weightGraph")
					.attr('class', 'area')
					.attr('width', width);

				svg.append('path')
					.datum(info)
					.attr("d", area);
				  	//.append("g")
				    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				// d3.select(self.node).attr('width', width);
				// var area = svg.append("path")
				// 	.datum(info)
				// 	.attr("class", "area")
				// 	.attr("d", area);
			
				// svg.append("g")
				// 	.attr("class", "x axis")
				// 	.attr("transform", "translate(0," + height + ")")
				// 	.call(xAxis)

				// svg.append("g")
				// 	.attr("class", "y axis")
				// 	.call(yAxis)
				// 	.append("text")
				// 	//.attr("transform", "rotate(-90)")
				// 	.attr("y", 6)
				// 	.attr("dy", ".71em")
				// 	.style("text-anchor", "left")
				// 	.text("Weight");
			});
		}
	}	
}