var RulesView = Backbone.View.extend({
	el: '#app',
	events: {
		'click #btn-save': 'save',
	},
	initialize: function()
	{
		this.template = _.template($('#rules-tpl').html(), {variable: 'data'})({
			time_on_move: 0,
			max_move: 0,
			speed_bonus_value: 0,
			time_minus_speed_bonus: 0,
			time_through_which_you_can_play_again: 0,
			time_reset_date: 0,
			time_reset_date: 0,
			total_gamblers_of_week: 0,
			total_gamblers_of_mon: 0,
			total_invitation_friends_on_one_game: 0,
			total_awards_on_one_invite: 0,
		});
		
		this.$el.html(this.template);
		this.$('.datepicker').datepicker({
			dateFormat: "yy-mm-dd",
		});
	},
	render: function()
	{
	},
	save: function(){
		
	}
});