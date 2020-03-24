var StatCollection = Backbone.Collection.extend({
	model: StatRowModel,
	sortParam: 'points',
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