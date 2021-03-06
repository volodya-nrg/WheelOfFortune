var ThemeCollection = Backbone.Collection.extend({
	model: ThemeRowModel,
	sortParam: 'name',
	sortMode: 1,
	comparator: function(a, b){
		if(a.get(this.sortParam) > b.get(this.sortParam)){
			return -1 * this.sortMode;	
		}
		if(a.get(this.sortParam) < b.get(this.sortParam)){
			return this.sortMode;	
		}
		
		return 0;
	},
});