var PhraseRowModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: "empty",
		theme: "",
		complexity: 'normal',
		status: 0,
		checked: false,
		is_hide: 0,
	},
	url: '/admin/phrase',
	initialize: function(){},
	validate: function(attrs){},
});