DailyCalories = new Meteor.Collection('dailyCalories');
//	Meteor.subcribe('dailyCalories');

if (Meteor.isClient) {
	Template.superbar.events({
		'keyup #search': function(evt) {
			if(evt.type === 'keyup' && evt.which === 13) {
				var parseValue = function(value) {
					return { 'calories': 0, 'quantity': 0, 'date': new Date() };	
				}

				var info = parseValue(evt.target.value);
				console.log('enter pressed:' + info.date);
				$(evt.target).popover({
					content: 'this is a popover!', 
					placement: 'bottom',
					trigger: 'manual',
					delay: { show: 100, hide: 500 }
				}).popover('show');

				setTimeout(function(){ $(evt.target).popover('destroy'); }, 5000);
			}
		},
	});

	Template.dailyReport.dailyCalories = function () {
		return DailyCalories.find({}, {sort: {date: -1}});
	};  

	Template.graphs.destroyed = function() {
		console.log('graphs.destroyed: ' + this.drawGraph);
		if(this.drawGraph) this.drawGraph.stop();
	};

	Template.graphs.rendered = function() {
		var self = this;
		self.node = self.find("svg");

		if(!self.drawGraph) {
			self.drawGraph = Deps.autorun(function(){
				var info = DailyCalories.find({}, {sort: {date: 1}}).fetch();
				var barPadding = 1;
				var w = 200;
				var h = 200;
				
				var updateBar = function(bar) {
					bar.attr("id", function (d) { return d._id; })
					.attr("x", function(d, i) { return i * (w / info.length); })//Bar width of 20 plus 1 for padding
					.attr("y", function(d) { return h - (d.calories / 10); }) //Height minus data value
					.attr("width", w / info.length - barPadding)
					.attr("height", function(d) { return d.calories / 10; })	
					.attr("fill", function(d) { 
						var colour = 'gray';
						if(d.calories > 1699) colour = 'green';
						if(d.calories > 2100) colour = 'red'; 	
						return colour;
					});					
				}

				var bars =d3.select(self.node).select('.bars').selectAll('rect')
					.data(info, function(i) { return i._id; });
					
				updateBar(bars.enter().append('rect'));
				updateBar(bars.transition().duration(250).ease("cubic-out"));
				bars.exit().remove();
			});	
		}
	};
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}
