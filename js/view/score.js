var ScoreView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#score-tpl').html()),
	initialize: function()
	{
		this.listenTo(this.model, 'change', this.render);
		
		this.getList(0);
		this.getList(1);
		this.getList(2);
	},
	render: function()
	{
		this.$el.html(this.template(this.model.attributes));
		
		return this;
	},
	getList: function(boardCode)
	{
		var that = this;
		
		// отсылаем запрос на сервер
		var builder = ProtoBuf.loadProtoFile('/proto/leaderboard_list.proto');
		var Request = builder.build('WORServer.Api.Leaderboard.List.Request');
		var Response = builder.build('WORServer.Api.Leaderboard.List.Response');
		var buff = Request.encode({
			ApiToken: $.cookie(window.cookieName),
			BoardCode: boardCode
		});

		// получаем данные об игре
		$.ajax({
			url: window.urlApi+"/leaderboard/list.ashx",
			data: new Uint8Array(buff.toArrayBuffer()),
			success: function(result, status, xhr){
				var obj = Response.decode(new Uint8Array(result));
				
				console.log('Response LeaderBoard', obj);
				
//				Good = 0;
//				Fail = 1;
//				NotEnoughMoney = 2;
//				AlreadyPlaying = 3;
//				TimeLimit = 4;
				if (obj.Status === 0 || obj.Status === 2 || obj.Status === 3 || obj.Status === 4) {
					if (boardCode === 0) {
						that.addResponseInModel("top_week", obj.Table);
						
					} else if(boardCode === 1) {
						that.addResponseInModel("top_month", obj.Table);
						
					} else if(boardCode === 2) {
						that.addResponseInModel("top_all", obj.Table);
						
					} else {
						alert('Error: not fount barCode');
					}
					
				} else {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
				}	
			}
		});
	},
	addResponseInModel: function(opt, data)
	{
		var col_top_opt = new ScoreCollection();
		
		for (var key in data) {
			col_top_opt.add({
				pos: data[key].Id,
				name: data[key].Name,
				points: data[key].Score
			});
		}
		
		this.model.set(opt, col_top_opt);
	}
});