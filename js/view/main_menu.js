var MainMenuView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#main-menu-tpl').html()),
	events: {
		'click #mainMenuBtnPlay': 'checkAccessOnGame',
	},
	initialize: function()
	{
		//this.listenTo(this.model, 'change', this.render);
	},
	render: function()
	{
		this.$el.html(this.template(this.model.attributes));
		
		if (this.model.get('doAnimateLogo') === true) {
			this.$('.img-wor-text').animateCss('zoomIn');
		}
		
		return this;
	},
	checkAccessOnGame: function()
	{
		if (window.GameWaitTimeLeft === 0) {
			redirectTo('/game');
			return;
		}
		
		window.timeend = new Date(2017, 6-1, 15, 24, 0);

		$('#popup-game-wait-time-left').modal({
			backdrop: true,
			keyboard: false,
			show: true
		});
		time();
	}
});