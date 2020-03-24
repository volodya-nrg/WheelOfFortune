var DeskModel = Backbone.Model.extend({
	defaults: {
		availableCells: [],
		currentOpenedChars: [],
		isOpenedAllChars: false,
	}
});