var PrizeRowView = Backbone.View.extend({
	tagName: 'tr',
	events: {
		'blur .edit-link, .edit-name, .edit-price': 'editValue',
		'click input[type=checkbox]': 'checkRow',
	},
	initialize: function()
	{
		this.template = _.template($('#prize-row-tpl').html());
		
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	render: function()
	{
		var view = this.template(this.model.attributes);
		
		this.$el.html(view);
			
		return this.$el;
	},
	editValue: function(){
		var res = this.model.set({
			link: $.trim(this.$('.edit-link').text()),
			name: $.trim(this.$('.edit-name').text()),
			price: $.trim(this.$('.edit-price').text()),
		});
		
		if (!res) {
			this.render();	
		}	
	},
	checkRow: function(){
		var val = this.model.get('checked');
		this.model.set('checked', !val);	
	},
});