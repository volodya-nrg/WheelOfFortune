var PrizeTblView = Backbone.View.extend({
	events: {
		'change input[name=image]': 'onChangeFile',
		'click #btn-add': 			'add',
		'click #btn-on-off': 		'onOff',
		'click #btn-delete': 		'deleteRow',
		'click [data-sort]': 		'renderList',
	},
	initialize: function()
	{
		this.template = _.template($('#prize-tbl-tpl').html());
		this.$el.html(this.template);
		
		this.col1 = new PrizeCollection();
		
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
		var link = $.trim(this.$('input[name=link]').val());
		var name = $.trim(this.$('input[name=name]').val());
		var price = $.trim(this.$('input[name=price]').val());
		
		if(this.$('.fileOutput > img').length){
			image = '<img height=30 src="'+ this.$('.fileOutput > img').prop('src') +'" />';
		
		} else {
			image = '<i class="fa fa-picture-o"></i>';	
		}
		
		if(name !== ""){
			this.$('.fileOutput').empty();
			this.$('input[type=reset]').click();
			
			this.col1.add({
				id: this.col1.length + 1,
				image: image,
				link: link,
				name: name,
				price: price,
				status: 0
			});
		}
	},
	addOne: function(model){
		var view = new PrizeRowView({model: model});
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
	onChangeFile: function(event){
		var file = $(event.target).prop("files")[0];
		var imageType = /image.*/;
		var $target = this.$('.fileOutput');
		
		if (file.type.match(imageType)) {
			var reader = new FileReader();
			
			reader.onload = function (e) {
				$target.empty();
				
				var img = new Image();
				img.src = e.target.result;
				img.width = 250;
				
				$target.html(img);
			};
			reader.readAsDataURL(file);
		
		} else {
			$target.text('File not supported!');
		}
	}
});