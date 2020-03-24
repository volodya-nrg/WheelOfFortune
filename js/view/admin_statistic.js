var StatisticView = Backbone.View.extend({
	el: '#app',
	events: {
	},
	initialize: function()
	{
		this.col1 = new StatCollection();
		
		for(var i=0; i<10; i++){
			this.col1.add({
				id: i,
				user: 'name' + i,
				points: 100 + i,
				date: '2016-10-0' + i
			});
		}
		
		this.template = _.template($('#statistic-tpl').html(), {variable: 'data'})({
			rows: this.col1.toArray()
		});
		
		this.$el.html(this.template);
	},
	render: function()
	{
	}
});