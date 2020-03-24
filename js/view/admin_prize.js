var PrizeView = Backbone.View.extend({
	el: '#app',
	events: {
	},
	initialize: function()
	{
		this.template = _.template($('#prize-tpl').html());
		
		this.render();
		
		this.$('#tab-reg').drawPrizeTbl();
		this.$('#tab-week').drawPrizeTbl();
		this.$('#tab-mon').drawPrizeTbl();
	},
	render: function()
	{
		var view = this.template();
		
		this.$el.html(view);
	},
});