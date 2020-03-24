var IndexView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#index-tpl').html()),
	initialize: function()
	{},
	render: function()
	{
		this.$el.html(this.template);
		
		// если в режиме отладки или пользователь авторизовался, то скроем кнопку автор-ии
		if (window.onFB === false || window.isAuthInFB === true) {
			this.$('#index-btn-auth-fb').hide();
		}
		
		return this;
	}
});