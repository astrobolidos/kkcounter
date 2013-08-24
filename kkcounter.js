DailyCalories = new Meteor.Collection('dailyCalories');
//	Meteor.subcribe('dailyCalories');

if (Meteor.isClient) {
	Template.superbar.events({
		'keyup #search': function(evt) {
			if(evt.type === 'keyup' && evt.which === 13) {
				var parseValue = function(value) {
					var info = { 'calories': 0, 'weight': 0, 'date': moment().format('YYYYMMDD') };
					
					var dateMatch = value.match(/(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])$/);
					if(dateMatch.length > 0 && moment(dateMatch[0], 'DD/MM').isValid()) {
						info.date = moment(dateMatch[0] + '/' + moment().year(),'DD/MM/YYYY').format('YYYYMMDD');
						value = value.replace(dateMatch[0], ''); 
					} 

					if(/yesterday/.test(value)) {
						info.date = moment().subtract('days', 1).format('YYYYMMDD');
						value = value.replace('yesterday', '');
					}

					if(/[\d.]*[\d]+[ ]*[c]/i.test(value)) {
						info.calories = Number($.trim(value.replace('c', '')))
						return updateCalories(info);
					}

					if(/[\d.]*[\d]+[ ]*[w]/i.test(value)) {
						info.weight = Number($.trim(value.replace('w', '')))
						return updateWeight(info);
					}
				}

				var updateCalories = function(info) {
					console.log(info);
					var message;
					if(info.calories != 0) {
						var daily = DailyCalories.findOne({date: info.date});
						if(daily) {
							DailyCalories.update(daily._id, {
								$inc: { calories: info.calories },
								$set: { date: info.date }
							});
							message = 'calories updated to: ' + daily.calories + ' for ' + moment(daily.date, 'YYYYMMDD').format('dddd');
						} else {
							DailyCalories.insert(info);
							message = 'calories inserted for today! ' + info.calories;
						}
					}
					return message;					
				}

				var updateWeight = function(info) {
					console.log(info);
					var message;
					if(info.weight != 0) {
						var daily = DailyCalories.findOne({date: info.date});
						if(daily) {
							DailyCalories.update(daily._id, {$set: {weight: info.weight, date: info.date }});
							message = 'weight updated to: ' + info.weight + ' for ' + moment(daily.date, 'YYYYMMDD').format('dddd');
						} else {
							DailyCalories.insert(info);
							message = 'weight inserted for today! ' + info.weight;
						}
					}
					return message;						
				}

				var message = parseValue(evt.target.value);		

				$(evt.target).popover({
					content: message == null ? 'nothing happened!' : message, 
					placement: 'bottom',
					trigger: 'manual',
					delay: { show: 100, hide: 500 },
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

	Template.graphs.events({
		'mouseover rect': function(event, template) {
			console.log(event.currentTarget);
			$('#search')[0].value =event.currentTarget.attributes['data-calories'].value; 
		},
		'mousedown rect': function(event, template) {
			console.log('mousedown ' + event.currentTarget.id);	
		},	
	});

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
					.attr('data-calories', function(d) { return d.calories; })
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
