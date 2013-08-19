DailyCalories = new Meteor.Collection('dailyCalories');
//	Meteor.subcribe('dailyCalories');

if (Meteor.isClient) {
	Template.dailyReport.dailyCalories = function () {
		return DailyCalories.find({}, {sort: {date: -1}});
	};  

	Template.dailyReport.formatDate = function() {
		return 'formatDate';
	};

	Template.dailyReport.percent = function(calories) {
		return Math.floor(calories / 2800 * 100);
	};

	Template.dailyReport.progressStyle = function(calories) {
		return  calories > 2200 ? 'progress-danger' : (calories > 1950 ? 'progress-warning' : 'progress-success');
	};

	Template.dailyReport.events({
		'click #add': function() {
			console.log('click add');
		},
		
		'keyup .calories': function(evt) {
			if(evt.type === "keyup" && evt.which === 13 ) {
				DailyCalories.update(this._id, { $set: {calories: Number(evt.target.value)}});
			}
		}
	});

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
					.attr("fill", 'teal');					
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
