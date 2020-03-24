var PhraseView = Backbone.View.extend({
	el: '#app',
	events: {
		'click #btn-add': 		'add',
		'click #btn-on-off': 	'onOff',
		'click #btn-delete': 	'deleteRow',
		'click #btn-refresh': 	'refresh',
		'click [data-sort]': 	'renderList'
	},
	initialize: function()
	{
		this.template = _.template($('#phrase-tpl').html(), {variable: 'data'})({
			themes: []
		});
		this.$el.html(this.template);
		
		this.col1 = new PhraseCollection();
		
		this.listenTo(this.col1, 'all', this.render);
		this.listenTo(this.col1, 'add', this.addOne);
	},
	render: function()
	{
	},
	renderList: function(event){
		this.$('tbody').html('');
		this.col1.sortParam = $(event.target).data('sort');
		this.col1.sortMode = -1 * this.col1.sortMode;
		this.col1.sort();
		
		var that = this;
		this.col1.each(function(model, index){
			that.addOne(model);
		});
	},
	add: function(){
		var theme = $.trim(this.$('select[name=theme]').val());
		var complexity = $.trim(this.$('select[name=complexity]').val());
		var name = $.trim(this.$('input[name=phrase]').val());
		
		if(name !== ""){
			this.$('input[name=phrase]').val("");
			this.col1.add({
				id: this.col1.length + 1,
				name: name,
				theme: theme,
				complexity: complexity,
				status: 0,
				checked: false
			});
		}
	},
	addOne: function(model){
		var view = new PhraseRowView({model: model});
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
	},
	refresh: function(){
		if(this.$('input[name=show_not_set]').is(':checked')){
			this.col1.each(function(model, index){
				if(model.get('status')){
					model.set('is_hide', 1);
				}
			});
			
		} else {
			this.col1.each(function(model, index){
				model.set('is_hide', 0);
			});	
		}
	}
});