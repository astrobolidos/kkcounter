DailyCalories = new Meteor.Collection('dailyCalories');
Foods = new Meteor.Collection('foods');
//	Meteor.subcribe('dailyCalories');

if (Meteor.isClient) {	
	Template.autocomplete.foods = function() {
		return Foods.find({'name': {$regex: Session.get('foodName') }});
	};
	
	Template.autocomplete.preserve({
		'.popover': function(node) { return node.id; }
	});

	Template.autocomplete.rendered = function() {
		this.find('.food:first-child').focus();
	};
	
	Template.autocomplete.events({
		'keyup #food': function(evt) {
			console.log(evt.type);
			console.log(evt.which);
			/*if(evt.type === 'keyup' && evt.which === 13) {
				console.log(evt.target.value);
			}*/
		},
	});

	Template.superbar.events({
		'keyup #search': function(evt) {
			if(evt.type === 'keyup' && evt.which === 13) {
				showPopupMessage(evt.target, parseValue(evt.target), 5000);		
			}
		},
	});

	Template.dailyReport.dailyCalories = function () {
		return DailyCalories.find({}, {sort: {date: -1}});
	};  

	showPopupMessage = function(target, message, timeout) {
		if(target && message && message.length > 0) {
			$(target).popover({
				content: message == null ? 'nothing happened!' : message, 
				placement: 'bottom',
				trigger: 'manual',
				delay: { show: 100, hide: 500 },
			}).popover('show');

			setTimeout(function(){ $(target).popover('destroy'); }, timeout);
		}
	}

	parseValue = function(target) {
		var value = target.value;
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
			return $.param(search)
		}

		if(value) {
			showFoods(target, value);
		}
	}

	showFoods = function(target, value) {
		console.log(target);
		console.log(value);

		Session.set('foodName', value);

		if(!$(target).next('div.popover:visible').length){
			$(target).popover({
				content: Meteor.render(Template.autocomplete), 
				html: true,
				placement: 'bottom',
				trigger: 'manual',
				delay: { show: 100, hide: 500 },
			}).popover('show');
		
			setTimeout(function(){ $(target).popover('destroy'); }, 15000);
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
