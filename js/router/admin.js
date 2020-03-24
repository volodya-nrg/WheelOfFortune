var AdminRouter = Backbone.Router.extend({
	routes: {
		"admin/": 				"theme",
		"admin/theme": 			"theme",
		"admin/phrase": 		"phrase",
		"admin/rules": 			"rules",
		"admin/prize": 			"prize",
		"admin/statistic": 		"statistic",
	},
	initialize: function()
	{
		Backbone.history.start({pushState: true});
		
		$(document.body).on('click', 'a', function(e){
			e.preventDefault();
			Backbone.history.navigate(e.currentTarget.pathname, {trigger: true});
		});
	},
	theme: function()
	{
		new ThemeView();
	},
	phrase: function()
	{
		new PhraseView();
	},
	rules: function()
	{
		new RulesView();
	},
	prize: function()
	{
		new PrizeView();
	},
	statistic: function()
	{
		new StatisticView();
	},
});