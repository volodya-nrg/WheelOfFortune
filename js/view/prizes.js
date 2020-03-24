var PrizesView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#prizes-tpl').html()),
	
	initialize: function()
	{
		this.listenTo(this.model, 'change:list', this.render);
	},
	render: function()
	{
		this.$el.html(this.template(this.model.attributes));
		
		this.$('.slick').slick({
			dots: false,
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 360,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
		
		return this;
	}
});