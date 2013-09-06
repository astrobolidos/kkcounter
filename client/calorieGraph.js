if(Meteor.isClient) {
	Template.calorieGraph.events({
		'mouseover rect': function(event, template) {
			console.log(event.currentTarget);
			$('#search')[0].value =event.currentTarget.attributes['data-calories'].value; 
		},
		'mousedown rect': function(event, template) {
			console.log('mousedown ' + event.currentTarget.id);	
		},	
	});

	Template.calorieGraph.destroyed = function() {
		console.log('graphs.destroyed: ' + this.drawGraph);
		if(this.drawGraph) this.drawGraph.stop();
	};

	Template.calorieGraph.rendered = function() {
		var self = this;
		self.node = self.find("svg");

		if(!self.drawGraph) {
			self.drawGraph = Deps.autorun(function(){
				var info = DailyCalories.find({}, {sort: {date: 1}}).fetch();
				var barPadding = 1;
				var w = 900;
				var h = 100;
				
				var updateBar = function(bar) {
					bar.attr("id", function (d) { return d._id; })
					.attr('data-calories', function(d) { return d.calories; })
					.attr("x", function(d, i) { return i * (w / info.length); })//Bar width of 20 plus 1 for padding
					.attr("y", function(d) { return h - (d.calories / 20); }) //Height minus data value
					.attr("width", w / info.length - barPadding)
					.attr("height", function(d) { return d.calories / 20; })	
					.attr("fill", function(d) { 
						var colour = 'gray';
						if(d.calories > 1699) colour = 'green';
						if(d.calories > 2100) colour = 'red'; 	
						return colour;
					});					
				}

				var bars = d3.select(self.node)
								.select('.bars')
								.selectAll('rect')
								.data(info, function(i) { return i._id; });
					
				updateBar(bars.enter().append('rect'));
				updateBar(bars.transition().duration(250).ease("cubic-out"));
				bars.exit().remove();
			});	
		}
	};	
}