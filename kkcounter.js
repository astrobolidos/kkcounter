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

	Template.graphs.rendered = function() {
		console.log('graphs.rendered()');

		

		var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
		               11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

		var div = this.find('#bar');
		var w = 500;
		var h = 200;
		var barPadding = 1;

		var svg = d3.select(div)
		    .append("svg")
		    .attr("width", w)
		    .attr('height', h);

		svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append("rect")
			.attr("x", function(d, i) {
				return i * (w / dataset.length);  //Bar width of 20 plus 1 for padding
			})
			.attr("y", function(d) {
				return h - (d*4);  //Height minus data value
			})
			.attr("width", w / dataset.length - barPadding)
			.attr("height", function(d) {
				return d * 4;
			})		
			.attr("fill", function(d) {
			    return "rgb(0, 0, " + (d * 10) + ")";
			});

		svg.selectAll("text")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("x", function(d, i) {
				return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
			})
			.attr("y", function(d) {
				return h - (d * 4) + 14;  //15 is now 14
			})
			.attr("text-anchor", "middle")
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white");
	};
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}
