DailyCalories = new Meteor.Collection('dailyCalories');
Foods = new Meteor.Collection('foods');
//	Meteor.subcribe('dailyCalories');

if (Meteor.isClient) {	
	Template.superbar.events({
		'keyup #search': function(evt) {
			if(evt.type === 'keyup' && evt.which === 13) {
				

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

	parseValue = function(value) {
		var info = { 'calories': 0, 'weight': 0, 'date': moment().format('YYYYMMDD') };
		
		var dateMatch = value.match(/(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])$/);
		if(dateMatch && dateMatch.length > 0 && moment(dateMatch[0], 'DD/MM').isValid()) {
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

		if(/[\d.]*[\d]+[ ]*[k]/i.test(value)) {
			info.weight = Number($.trim(value.replace('k', '')))
			return updateWeight(info);
		}

		if(/([\d]+[ ]*[g])[ ]*[\w]+/.test(value)) {
			var search = { foodName: '', quantity: 0, caloriesPer100: 0 };
			var quantityMatch = value.match(/[\d]+[ ]*[kg]/)[0];
			search.quantity = Number($.trim(quantityMatch.replace('g', '')));

			value = value.replace(quantityMatch, '');
			search.foodName = $.trim(value);

			console.log(search);
			return $.param(search	)
		}
	}

	updateCalories = function(info) {
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

	updateWeight = function(info) {
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}
