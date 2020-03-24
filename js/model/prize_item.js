var PrizeItemModel = Backbone.Model.extend({
	defaults: {
		id: 0, 
		name: "", 
		description: "", 
		urlImage: '/img/test.jpg',
		price: 0,
		userPoints: 0
	}
});