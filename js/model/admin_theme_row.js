var ThemeRowModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: "empty",
		total_words: 0, 
		status: 0,
		checked: false,
	},
	url: '/admin/theme',
	initialize: function(){},
	validate: function(attrs){},
});