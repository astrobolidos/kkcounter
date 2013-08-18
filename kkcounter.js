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
		if(this.drawGraph) this.drawGraph.stop();
	};

	Template.graphs.rendered = function() {
		console.log('graphs.rendered()');
		
		this.node = this.find('#bar');
		var w = 500;
		var h = 200;
		var barPadding = 1;

		var svg = d3.select(this.node)
			.append("svg")
			.attr("width", w)
			.attr('height', h);

		if(!this.drawGraph) {
			this.drawGraph = Deps.autorun(function(){
				console.log('Deps.autorun');

				var info = DailyCalories.find({}, {sort: {date: -1}}).fetch();
			
				if(info.length > 0) {
					svg.selectAll('rect')
						.data(info, function(i) { 
							return i.calories; 
						})
						.enter()
						.append("rect")
						.attr("x", function(d, i) {
							return i * (w / info.length); //Bar width of 20 plus 1 for padding
						})
						.attr("y", function(d) {
							return h - (d.calories/10); //Height minus data value
						})
						.attr("width", w / info.length - barPadding)
						.attr("height", function(d) {
							return d.calories / 10;
						})	
						.attr("fill", 'teal');
				}



			});	
		}
	};
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}
