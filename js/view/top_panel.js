var TopPanelView = Backbone.View.extend({
	el: '#top-panel',
	template: _.template($('#top-panel-tpl').html()),
	
	initialize: function()
	{	
		this.listenTo(this.model, 'change', this.render);
		//this.listenTo(this.model, 'change:points', this.checkPoints);
	},
	render: function()
	{
		this.$el.html(this.template(this.model.attributes));
		
		return this;
	},
	checkPoints: function()
	{
//		var $obj = window.app.view.game.$('#btn-buy-letter');
//		
//		// если очков хватает
//		if (this.model.get('points') > window.app.model.game.get('vowel_price')) {
//			// нужно проверить: если ли что еще открывать или же все уже нажаты
//			if (window.app.view.alphabit.$('.alphabit-vowel.active').length < window.app.view.alphabit.aVowels.length) {
//				$obj.prop('disabled', false);
//			}
//	
//		} else {
//			$obj.prop('disabled', true);
//		}
	}
});