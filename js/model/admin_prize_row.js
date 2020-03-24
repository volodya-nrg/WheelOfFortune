var PrizeRowModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		image: '<i class="fa fa-picture-o"></i>',
		link: "empty",
		name: "empty",
		price: 0,
		status: 0,
		checked: false,
	},
	url: '/admin/prize',
	initialize: function(){},
	validate: function(attrs){},
});