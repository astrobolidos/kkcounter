var data = [
	{ w: 106.7, d: '20130803' },
	{ w: 106.5, d: '20130804' },
	{ w: 106.0, d: '20130805' },	
	{ w: 105.8, d: '20130806' },	
];

if(Meteor.isClient) {
	Template.weightGraph.rendered = function() {	
		var self = this;
		self.node = self.find("svg");
		var height = 200;

		var area = d3.svg.area()
			.x(function(d) { return x(d.d); })
			.y0(height)
			.y1(function(d) { return y(d.w); });

		var area = d3.select(self.node)
			.append("path")
			.data(data)
			.attr("class", "area")
			.attr("d", area);

		/*if(!self.drawGraph) {
			self.drawGraph = Deps.autorun(function(){

			});
		}*/
	}	
}