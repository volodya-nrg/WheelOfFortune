var GameModel = Backbone.Model.extend({
	defaults: {
		gameId: null,
		theme: '',
		vowel_price: 0,
		time_show_alert_when_end_game: 30000,
		speed_bonus_value_minus: 25,
		showModalInStart: false
	}
});