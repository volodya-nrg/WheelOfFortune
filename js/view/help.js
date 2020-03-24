var HelpView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#help-tpl').html()),
	
	initialize: function()
	{
	},
	render: function()
	{
		this.$el.html(this.template);
		
		return this;
	}
});