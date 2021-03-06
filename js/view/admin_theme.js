var ThemeView = Backbone.View.extend({
	el: '#app',
	events: {
		'click #btn-add': 		'add',
		'click #btn-on-off': 	'onOff',
		'click #btn-delete': 	'deleteRow',
		'click [data-sort]': 	'renderList',
	},
	initialize: function()
	{
		this.template = _.template($('#theme-tpl').html());
		this.$el.html(this.template);
		
		this.col1 = new ThemeCollection();
		
		this.listenTo(this.col1, 'all', this.render);
		this.listenTo(this.col1, 'add', this.addOne);
	},
	render: function()
	{
		// тут можно например показывать кол-во строк	
	},
	renderList: function(event){
		this.$('#target').html('');
		this.col1.sortParam = $(event.target).data('sort');
		this.col1.sortMode = -1 * this.col1.sortMode;
		this.col1.sort();
		
		var that = this;
		this.col1.each(function(model, index){
			that.addOne(model);
		});
	},
	add: function(){
		var name = $.trim(this.$('input[name=theme]').val());
		
		if(name != ""){
			this.$('input[name=theme]').val("");	
			this.col1.add({
				id: this.col1.length+1,
				name: name
			});
		}
	},
	addOne: function(model){
		var view = new ThemeRowView({model: model});
		this.$('#target').append(view.render());
	},
	onOff: function(){
		this.col1.each(function(model, index){
			if(model.get('checked')){
				var val = model.get('status');
				
				model.set('status', val? 0: 1);	
			}
		});
	},
	deleteRow: function(){
		var aModels = [];
		this.col1.each(function(model, index){
			if(model.get('checked')){
				aModels.push(model);
			}
		});
		
		this.col1.remove(aModels);
		
		for(var i=0; i < aModels.length; i++){
			aModels[i].destroy({silent:true});
		}
	}
});