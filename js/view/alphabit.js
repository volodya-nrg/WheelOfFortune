var AlphabitView = Backbone.View.extend({
	el: '#alphabit',
	aVowels: ['a', 'e', 'i', 'o', 'u', 'y'],
	aAlphabit: [
		['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
		['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	],
	events:{
		'click .alphabit-item': 'onClickAlphabitItem'	
	},
	initialize: function()
	{
		this.template = _.template($('#alphabit-tpl').html(), {variable: 'data'})({
			aVowels: this.aVowels,
			aAlphabit: this.aAlphabit
		});
	},
	render: function()
	{
		this.$el.html(this.template);
		
		return this;
	},
	onClickAlphabitItem: function(event)
	{
		var obj = (event.target.nodeName.toLowerCase() === 'span')? $(event.target).parent(): $(event.target);
		var that = this;
		
		// если кнопка отключена или ее уже ранее выбрали, или родитель закрыт
		if($(obj).hasClass('disabled')){
			console.log('this has disabled');
			return;	
		}
		if($(obj).hasClass('active')){
			console.log('this has active');
			return;	
		}
		if($(obj).closest('#alphabit').hasClass('locked')){
			console.log('locked');
			return;	
		}
		
		var letter = $.trim($(obj).text());
		this.deactivateLetter(letter);
		
		// остановим счетчик
		clearInterval(window.counter);
		window.counterInt = 0;
		window.app.view.game.$('#counter').text(window.counterInt);
		
		// если нажали на гласную букву
		if($(obj).hasClass('alphabit-vowel')){
			// включим согласные
			// this.onOffConsonants('on');

			// выключим гласные
			// this.onOffVowels('off');
			
			// включим кнопку "назвать фразу"
			// window.app.view.game.$('#btn-ask-phrase').prop('disabled', false);
		}
		
		// выключим алфавит, чтоб лишний раз не нажимали
		window.app.view.alphabit.onOffAlphabit('off');
		
		// отсылаем запрос на сервер
		var builder = ProtoBuf.loadProtoFile('/proto/next.proto');
		var Request = builder.build('WORServer.Api.Game.Next.Request');
		var Response = builder.build('WORServer.Api.Game.Next.Response');
		var buff = Request.encode({
			ApiToken: $.cookie(window.cookieName),
			GameId: window.app.model.game.get('gameId'),
			AnswerCode: 0,
			Letter: letter
		});

		//console.log("отправляем букву - "+letter);
		//console.log('отсылаем запрос на /game/next');
		
		// т.к. отправляем данные, выключим алфавит
		window.app.view.alphabit.onOffAlphabit('off');
		// получаем данные об игре
		$.ajax({
			url: window.urlApi+"/game/next.ashx",
			data: new Uint8Array(buff.toArrayBuffer()),
			success: function(result, status, xhr){
				var obj = Response.decode(new Uint8Array(result));
				
				console.log('Response Next', obj);
				
				window.app.model.top_panel.set({
					round: obj.Game.CountStep,
					xod: obj.Game.CountLives,
					points: obj.Game.CountScore
				});
				
				// создаем именно копию, т.к. массив является объектом, поэтому передача будет по ссылке
				var aReciver = arrayClone(window.app.model.desk.get('currentOpenedChars'));
				var hasOpenedChars = false;
				
				// возьмем новые буквы
				for(var i=0; i<obj.Game.Letters.length; i++){
					// возьмем буквы каторые отгадали, если буква есть в массиве, то отгадали
					for(var j=0; j < obj.Game.Letters[i].CurrentOpenedChars.length; j++){
						var symbol = obj.Game.Letters[i].CurrentOpenedChars[j];
						
						if (symbol !== "") {
							hasOpenedChars = true;
							aReciver[i][j] = symbol;
						} else {}
					}
				}
				
				window.app.model.desk.set('currentOpenedChars', aReciver);
				
//				Playing = 0; 
//				Winner = 1; 
//				Loser = 2; 
//				BonusGame = 3; 
				if (obj.Game.Status === 0) {
					// узнаем: угадал или нет
					hasOpenedChars? doSound('char-win'): doSound('char-lose');
					
					// узнаем что включать по поводу алфивита
					window.app.view.alphabit.onOffAlphabit('on');
					window.app.view.alphabit.onOffConsonants(obj.Game.IsConsonantsAvailable? 'on': 'off');
					window.app.view.alphabit.onOffVowels(obj.Game.IsVowelsAvailable? 'on': 'off');
					window.app.view.game.$('#btn-ask-phrase').attr('disabled', !obj.Game.IsWordAvailable);
					window.app.view.game.$('#btn-go-next').attr('disabled', !obj.Game.IsRotateAvailable);
					
					// запустим счетчик	
					window.app.view.game.startTimer(obj.Game.TimeLeft);
					
					// покажем колесо
					if (obj.Game.IsAnimateWheel) {
						setTimeout(function(){
							window.app.view.game.$('#popupWheel').modal('show').one('shown.bs.modal', function(){
								// запустим колесо, учитываем fadeIn. Информация о будущем 
								// секторе уже тут есть, сохраним ее после spinStart();
								window.app.view.game.spinStart();
								window.app.view.wheel.selected_sector = obj.Game.SectorIndex;
							});
						}, window.timeoutAfterOpenChar);
					}
					
				} else if (obj.Game.Status === 1) {
					window.app.view.game.showWinLose(1);
					
				} else if (obj.Game.Status === 2) {
					window.app.view.game.showWinLose(0);
					
				} else if (obj.Game.Status === 3) {
					alert("is bonus game");
				}
			}
		});
	},
	onOffAlphabit: function(opt)
	{
		var $el = this.$el;
		opt === 'on'? $el.removeClass('locked'): $el.addClass('locked');
	},
	onOffVowels: function(opt)
	{
		var $el = this.$('.alphabit-vowel');
		opt === 'on'? $el.removeClass('disabled'): $el.addClass('disabled');
	},
	onOffConsonants: function(opt)
	{
		var $el = this.$('.alphabit-consonants');
		opt === 'on'? $el.removeClass('disabled'): $el.addClass('disabled');
	},
	deactivateLetter: function(letter)
	{
		var $obj = this.$('.alphabit-item[symbol="'+letter.toLowerCase()+'"]');
		
		if ($obj.length && !$obj.hasClass('active')) {
			$obj.addClass('active');
		}
	}
});