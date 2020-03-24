var GetFriendsView = Backbone.View.extend({
	el: '#app',
	events: {
	},
	initialize: function() 
	{
		var col1 = new FriendsCollection();

		for(var i=0; i<10; i++){
			col1.add({
				id: i,
				name: 'test test ' + i
			});
		}
		
		this.template = _.template($('#get-friends-tpl').html(), {variable: 'data'})({
			friends: col1.toArray()
		});
	},
	render: function()
	{
		this.$el.html(this.template);
		
		this.$('.slick').slick({
			dots: false,
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: []
		});
		
		return this;
	}
});