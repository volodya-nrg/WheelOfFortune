var PrizeItemView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#prize-item-tpl').html()),
	
	events: {
		'click #btn-ok': 'buy'
	},
	initialize: function()
	{
		this.listenTo(this.model, 'change', this.render);
	},
	render: function()
	{
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	buy: function(event){
		// узнаем состояние
		var builder = ProtoBuf.loadProtoFile('/proto/prizes_take.proto');
		var Request = builder.build('WORServer.Api.Prizes.Take.Request');
		var Response = builder.build('WORServer.Api.Prizes.Take.Response');
		var buff = Request.encode({
			ApiToken: $.cookie(window.cookieName),
			PrizeId: this.model.get('id')
		});

		$(event.target).prop('disabled', true);
		$.ajax({
			url: window.urlApi+"/prizes/take.ashx",
			data: new Uint8Array(buff.toArrayBuffer()),
			success: function(result, status, xhr){
				var obj = Response.decode(new Uint8Array(result));

				console.log('Response PrizesTake', obj);
				
				$(event.target).prop('disabled', false);
				
				if (obj.Status === 0) {
					redirectTo('/main_menu');
				
				} else {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
				}
			}
		});
	}
});