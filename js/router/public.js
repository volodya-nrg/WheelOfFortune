var PublicRouter = Backbone.Router.extend({
	routes: {
		"": 				"index",
		"index": 			"index",
		"main_menu": 		"mainMenu",
		"score": 			"score",
		"prizes": 			"prizes",
		"prizes(/:prize)": 	"prizes",
		"game": 			"game",
		//"get-friend": 		"getFriend",
		"help":				"help"
	},
	initialize: function()
	{
		Backbone.history.start({ pushState: true });
		
		$(document.body).on('click', 'a', function(e){
			e.preventDefault();
			Backbone.history.navigate(e.currentTarget.pathname, {trigger: true});
		});
	},
	index: function()
	{
		window.app.view.index = new IndexView();
		window.app.view.index.render();
	},
	mainMenu: function()
	{
		var doAnimateLogo = false;
		
		if (_.isUndefined(window.app.view.mainMenu)) {
			window.app.model.mainMenu = new MainMenuModel();
			window.app.view.mainMenu = new MainMenuView({
				model: window.app.model.mainMenu
			});
			doAnimateLogo = true;
		}
		
		window.app.model.mainMenu.set({
			'isShowBtnGetPrize': window.isTakePrize,
			'doAnimateLogo': doAnimateLogo
		});
		window.app.view.mainMenu.render();
	},
	game: function()
	{	
		// без куки делать нечего
		if(_.isUndefined($.cookie(window.cookieName)) || window.GameWaitTimeLeft){
			window.location.href = "/";
			return;
		}
		
		var builder = ProtoBuf.loadProtoFile('/proto/staticinfo.proto');
		var Request = builder.build('WORServer.Api.Game.StaticInfo.Request');
		var Response = builder.build('WORServer.Api.Game.StaticInfo.Response');
		var buff = Request.encode({
			ApiToken: $.cookie(window.cookieName)
		});
		
		//console.log('отправляем запрос на staticinfo');
		$.ajax({
			url: window.urlApi+"/game/staticinfo.ashx",
			data: new Uint8Array(buff.toArrayBuffer()),
			success: function(result, status, xhr){
				var obj = Response.decode(new Uint8Array(result));
				
				console.log('Response StaticInfo', obj);
				
				window.timeoutAfterOpenChar = obj.OpenLetterAnimationTime * 1000;
				
				// Good = 0; NotEnoughMoney = 2; AlreadyPlaying = 3;
				// выставим основу
				if(obj.Status === 0 || obj.Status === 2 || obj.Status === 3){
					window.app.model.game = new GameModel({
						gameId: window.gameId,
						vowel_price: obj.VowelPrice,
						showModalInStart: window.gameAlreadyPlaying? false: true
					});
					
					window.app.view.game = new GameView({
						model: window.app.model.game
					});
					window.app.view.game.render();
					
					// ---- сформируем дополнительные модули ----
						// покажем верхнее меню
						window.app.model.top_panel = new TopPanelModel();
						window.app.view.top_panel = new TopPanelView({
							model: window.app.model.top_panel	
						});

						// сформируем view табло
						window.app.model.desk = new DeskModel();
						window.app.view.desk = new DeskView({
							model: window.app.model.desk
						});

						// сформируем view алфавит
						window.app.view.alphabit = new AlphabitView();
						
						// сформируем view колесо
						var aSectors = [];
						for(var i = 0; i < obj.Sectors.length; i++){
							aSectors.push(obj.Sectors[i].Title);
						}
						window.app.model.wheel = new WheelModel({
							wheelAnimationTime: obj.WheelAnimationTime * 1000,
							aWheelValues: aSectors
						});
						window.app.view.wheel = new WheelView({
							model: window.app.model.wheel
						});

						// отрисуем доп-ые части
						window.app.view.top_panel.render();
						window.app.view.desk.render();
						window.app.view.alphabit.render();
						window.app.view.wheel.render();

						// включим алфавит
						window.app.view.alphabit.onOffAlphabit('on');
						
					if (window.gameAlreadyPlaying === true) {
						//console.log("игра уже запущена, нажимаем автом-ом запуск игры");
						// если игра началась, скроем кнопку запуска под барабаном
						window.app.view.game.$('#btn-spin-start').hide();
						
						// запустим обновление gameId, чтоб отрисовались нужные кнопки
						window.app.view.game.updateWithGameId();
						
						// запросим информацию
						window.app.view.wheel.getGameInfo();
					}
					
					// doAnimateIconFromWheelToBottom("#icon-circles .icon-circle.icon-circle-lucky");
					
//				Fail = 1;	
				} else if(obj.Status === 1) {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
					
//				TimeLimit = 4;		
				} else if(obj.Status === 4) {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
					
				} else {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
				}
			}
		});
	},
	score: function()
	{
		window.app.model.score = new ScoreModel({
			top_week: new ScoreCollection(),
			top_month: new ScoreCollection(),
			top_all: new ScoreCollection()
		});
		window.app.view.score = new ScoreView({
			model: window.app.model.score
		});
		window.app.view.score.render();
	},
	prizes: function(prize)
	{
		if (window.isTakePrize === false) {
			window.location.href = "/main_menu";
			return;
		}
		
		// если перешли на страницу списка
		if (_.isNull(prize)) {
			if (_.isUndefined(window.app.view.prizes)) {
				window.app.model.prizes = new PrizeListModel({
					points: window.userPoints,
					list: (window.app.col.prizes !== undefined? window.app.col.prizes: new PrizesCollection())
				});	
				window.app.view.prizes = new PrizesView({
					model: window.app.model.prizes
				});
			}
			
			window.app.view.prizes.render();
		
		// страница конкретного приза
		} else {
			var model = _.isUndefined(window.app.col.prizes)? new PrizeItemModel(): window.app.col.prizes.get(prize);
			
			model.set('userPoints', window.userPoints);
			window.app.view.prizeItem = new PrizeItemView({
				model: model
			});
			
			window.app.view.prizeItem.render();
		}
		
		if (_.isUndefined(window.app.col.prizes)) {
			// сразу выставим по умолчанию
			window.app.col.prizes = new PrizesCollection();
			
			var builder = ProtoBuf.loadProtoFile('/proto/prizes_list.proto');
			var Request = builder.build('WORServer.Api.Prizes.List.Request');
			var Response = builder.build('WORServer.Api.Prizes.List.Response');
			var buff = Request.encode({
				ApiToken: $.cookie(window.cookieName)
			});

			//console.log('отправляем запрос на prizes/list');
			$.ajax({
				url: window.urlApi+"/prizes/list.ashx",
				data: new Uint8Array(buff.toArrayBuffer()),
				success: function(result, status, xhr){
					var obj = Response.decode(new Uint8Array(result));
					
					console.log("Response PrizeList", obj);
					
					for (var i=0; i<obj.Prizes.length; i++) {
						var item = obj.Prizes[i];
						
						window.app.col.prizes.add({
							id: item.Id, 
							name: item.Name, 
							description: item.Description, 
							urlImage: item.UrlImage,
							price: item.Price,
							userPoints: window.userPoints
						});
					}
					
					// если на данный момент просматривают список
					if (_.isNull(prize)) {
						window.app.view.prizes.model.set('list', window.app.col.prizes);
					
					} else {
						window.app.view.prizeItem.model.set(window.app.col.prizes.get(prize).attributes);
					}
				}
			});
		}
	},
//	getFriend: function()
//	{
//		window.app.view.getFriend = new GetFriendsView();
//		window.app.view.getFriend.render();
//	},
	help: function()
	{
		window.app.view.help = new HelpView();
		window.app.view.help.render();
	},
	execute: function(callback, args, name)
	{
		if(name === 'mainMenu'){
			$('.modal-backdrop').remove(); // удалим остатки от игры
		}
		
		if (callback) {
			//args.push(parseQueryString(args.pop()));
			callback.apply(this, args);
		} 
	}
});