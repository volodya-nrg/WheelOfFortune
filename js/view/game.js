var GameView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#game-tpl').html()),
	events: {
		'click #btn-ask-phrase': 'askPhrase',
		'click #btn-go-next': 'goNext',
		'click #btn-spin-start': 'spinStart',
		'click #btn-send-phrase': 'sendPhraseOnServer',
		'click #btn-invite-friends': 'inviteFriends'
	},
	initialize: function()
	{
		// Iris Mittenar
		this.listenTo(this.model, 'change:theme', this.updateTheme);
		this.listenTo(this.model, 'change:gameId', this.updateWithGameId);
	},
	render: function()
	{
		this.$el.html(this.template(this.model.attributes));
		
		// если без FB тестируем, то выключим кнопку
		if (window.onFB === false) {
			this.$('#btn-invite-friends').attr('disabled', true);
		}
		
		// покажем сразу модаль
		this.$('#popupWheel').modal({
			backdrop: 'static',
			keyboard: false,
			show: this.model.get('showModalInStart')
		});
		
		setTimeout(function(){
			var aEl = ['.icon-circle-lucky', '.icon-circle-airbag', '.icon-circle-prize'];
			var offsetCenterWheel = window.app.view.wheel.$('.wheel-wraper-main-logo').offset();

			for(var i=0; i<aEl.length; i++){
				$item = window.app.view.game.$('.icon-circle'+aEl[i]).clone();

				$item.removeClass("disabled");
				$item.prop('id', "asd"+i);
				$item.css({
					position: 'absolute',
					top: Math.round(offsetCenterWheel.top) + "px",
					left: Math.round(offsetCenterWheel.left) + "px",
					display: 'none',
					'z-index': 1051
				});
				$('body').append($item);
				$item.fadeIn(500);

				offset = window.app.view.game.$('#icon-circles .icon-circle'+aEl[i]).eq(0).offset();
				translateX = offset.left - $(window).width()/2 + 25;
				translateY = offset.top/2 + 71;
				target = '#asd'+i;

				anime({
					targets: target,
					translateX: translateX,
					translateY: translateY,
					rotate: '1turn',
					delay: 500,
					duration: 2000,
					easing: 'easeInOutQuad',
					scale: [
						{ value: 1, duration: 2000/3, easing: 'easeOutExpo' },
						{ value: 2, duration: 2000/3, easing: 'easeOutExpo' },
						{ value: 1, duration: 2000/3, easing: 'easeOutExpo' }
					],
					complete: function(anim) {
						$(anim.animatables[0].target).fadeOut('normal', function(){
							$(this).remove();
						});
					}
				});
			}
		}, 2000);
	},
	updateTheme: function()
	{
		this.$('#theme-title').text(this.model.get("theme"));
	},
	updateWithGameId: function()
	{
//		if (this.model.get('gameId') !== null) {
//			this.$('#btn-ask-phrase').prop('disabled', false);
//			
//		} else {
//			this.$('#btn-ask-phrase').prop('disabled', true);
//		}
	},
	askPhrase: function()
	{
		// 1. выключим текущую кнопку
		this.$('#btn-ask-phrase').attr('disabled', true);
		// 2. покажем, но не включим кнопку ОТПРАВИТЬ
		// this.$('#btn-send-phrase').attr('disabled', true);
		// 3. выключим алфавит
		window.app.view.alphabit.onOffAlphabit('off');
		// 4. развернуть закрытые буквы
		window.app.view.desk.openDeskCellNotGuess();
	},
	buyVowel: function()
	{
//		// включим алфавит
//		window.app.view.alphabit.onOffAlphabit('on');
//		
//		// выключим согласные
//		window.app.view.alphabit.onOffConsonants('off');
//		
//		// включим только гласные
//		window.app.view.alphabit.onOffVowels('on');
//		
//		// отнимим сразу очки
//		window.app.model.top_panel.set('points', window.app.model.top_panel.get('points') - this.model.get('vowel_price'));
//		// выключим кнопки
//		this.$('#btn-ask-phrase').prop('disabled', true);
	},
	goNext: function()
	{
		clearInterval(window.counter);
		window.counterInt = 0;
		window.app.view.game.$('#counter').text(window.counterInt);
		
		window.app.view.game.$('#popupWheel').modal('show').one('shown.bs.modal', function(){
			window.app.view.game.spinStart();
			
			// отсылаем запрос на сервер
			var builder = ProtoBuf.loadProtoFile('/proto/next.proto');
			var Request = builder.build('WORServer.Api.Game.Next.Request');
			var Response = builder.build('WORServer.Api.Game.Next.Response');
			var buff = Request.encode({
				ApiToken: $.cookie(window.cookieName),
				GameId: window.app.model.game.get('gameId'),
				AnswerCode: 2
			});

			$.ajax({
				url: window.urlApi+"/game/next.ashx",
				data: new Uint8Array(buff.toArrayBuffer()),
				success: function(result, status, xhr){
					// сохраним текущие данные, чтоб после остановки колеса еще проверить
					var obj = Response.decode(new Uint8Array(result));

					console.log("Response GameNext", obj);

					if(obj.Status === 0 || obj.Status === 2 || obj.Status === 3){
						// узнаем что включать по поводу алфивита
						//window.app.view.alphabit.onOffAlphabit('on');
						window.app.view.alphabit.onOffConsonants(obj.Game.IsConsonantsAvailable? 'on': 'off');
						window.app.view.alphabit.onOffVowels(obj.Game.IsVowelsAvailable? 'on': 'off');
						window.app.view.game.$('#btn-ask-phrase').attr('disabled', !obj.Game.IsWordAvailable);
						window.app.view.game.$('#btn-go-next').attr('disabled', !obj.Game.IsRotateAvailable);

						// запустим счетчик	
						window.app.view.game.startTimer(obj.Game.TimeLeft);
						// установим сектор
						window.app.view.wheel.selected_sector = obj.Game.SectorIndex;

					} else {
						showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
					}
				}
			});
		});
	},
	spinStart: function()
	{
		doSound('baraban');
		window.app.view.wheel.selected_sector = null; // обнулим предыдущий выбранный сектор
		window.app.view.wheel.startRotate();
	},
	setDefault: function()
	{
//		clearInterval(window.counter);
//		
//		//this.$('#counter').text(0);
//		this.$('#current-bit').text("");
//		this.$('.modal-result-msg').hide();
//		this.$('.icon-circle').addClass('disabled');
//		window.app.view.wheel.$('.wheel-wraper').removeClass('game-is-started');
//		
////		window.app.view.wheel.send_request_on_server = 0;
////		window.app.view.wheel.selected_sector = null;
////		window.app.view.wheel.is_spining = false;
////		window.app.view.wheel.angle_old = 0;
////		window.app.view.wheel.deg = 0;
////		window.app.view.wheel.save_number_point = 0;
////		window.app.view.wheel.tmp_game_info = null;
//		
//		window.app.model.game.set('gameId', null);
//		window.gameIsPlaying = false;
//		window.gameId = null;
//		
//		// включим кнопку Крутить
//		//this.$('#btn-spin-start').removeClass('hide');
//		// выключим кнопку НАЗВАТЬ ФРАЗУ
//		this.$('#btn-ask-phrase').prop('disabled', true);
//		// выключим кнопку ОТПРАВИТЬ ФРАЗУ и спрячем ее
//		this.$('#btn-send-phrase').prop('disabled', true).addClass('hide');
//		
//		// выключим гласные
//		window.app.view.alphabit.onOffVowels('off');
//		// включим согласные
//		window.app.view.alphabit.onOffConsonants('on');
//		// выключим алфавит
//		window.app.view.alphabit.onOffAlphabit('off');
	},
	startTimer: function(ms)
	{
		var that = this;
		window.counterInt = Math.round(ms/1000);
		this.$('#counter').text(window.counterInt);
		
		window.counter = setInterval(function(){
			window.counterInt--;
			
			if (window.counterInt > -1) {
				that.$('#counter').text(window.counterInt);
			}
			
			// если время закончилось, то уменьшим кол-во попыток в игре
			if(window.counterInt <= 0){
				// выключим счетчик
				clearInterval(window.counter);
				console.log("clearInterval");
				
				// если перед этим пытались угадать всю фразу, то закроем открытые ячейки
				if (window.app.view.desk.model.get('isOpenedAllChars') === true) {
					window.app.view.desk.closeDeskCellNotGuess();
					that.$('#btn-ask-phrase').attr('disabled', false);
					that.$('#btn-send-phrase').attr('disabled', true);
					window.app.view.alphabit.onOffAlphabit('on');
				}
				
				// отсылаем запрос на сервер
				var builder = ProtoBuf.loadProtoFile('/proto/info.proto');
				var Request = builder.build('WORServer.Api.Game.Info.Request');
				var Response = builder.build('WORServer.Api.Game.Info.Response');
				var buff = Request.encode({
					ApiToken: $.cookie(window.cookieName),
					GameId: that.model.get('gameId')
				});

				// получаем данные об игре
				$.ajax({
					url: window.urlApi+"/game/info.ashx",
					data: new Uint8Array(buff.toArrayBuffer()),
					success: function(result, status, xhr){
						var obj = Response.decode(new Uint8Array(result));

						console.log('Response GameInfo', obj);

						window.app.model.top_panel.set({
							round: obj.Game.Runtime.CountStep,
							xod: obj.Game.Runtime.CountLives,
							points: obj.Game.Runtime.CountScore
						});

						// узнаем что включать по поводу алфивита
						//window.app.view.alphabit.onOffAlphabit('on');
						window.app.view.alphabit.onOffConsonants(obj.Game.Runtime.IsConsonantsAvailable? 'on': 'off');
						window.app.view.alphabit.onOffVowels(obj.Game.Runtime.IsVowelsAvailable? 'on': 'off');
						window.app.view.game.$('#btn-ask-phrase').attr('disabled', !obj.Game.Runtime.IsWordAvailable);
						window.app.view.game.$('#btn-go-next').attr('disabled', !obj.Game.IsRotateAvailable);

		//				Playing = 0; 
		//				Winner = 1; 
		//				Loser = 2; 
		//				BonusGame = 3; 
						if (obj.Game.Runtime.Status === 0) {
							window.app.view.game.$('#popupWheel').modal('show').one('shown.bs.modal', function(){
								// запустим счетчик	
								window.app.view.game.startTimer(obj.Game.Runtime.TimeLeft);
								
								window.app.view.game.spinStart();
								window.app.view.wheel.selected_sector = obj.Game.Runtime.SectorIndex;
							});
							
						} else if (obj.Game.Runtime.Status === 1) {
							that.showWinLose(1);

						} else if (obj.Game.Runtime.Status === 2) {
							that.showWinLose(0);

						} else if (obj.Game.Runtime.Status === 3) {
							alert("is bonus game");

						} else {
							showErrorMsg('Status: unknown');
						}
					}
				});
			}
		}, 1000);
	},
	sendPhraseOnServer: function()
	{
		var aPhrase = [];
		var that = this;
		
		// надо пройтись по строкам и по ячейкам и собрать буквы
		window.app.view.desk.$('.desk-row').each(function(){
			var row = [];
	
			$(this).find('.desk-cell').each(function(){
				var $item = $(this);
				
				if($item.hasClass('desk-cell-colored') || $item.hasClass('desk-cell-colored-space')){
					var letter = "";
					
					if($item.hasClass('desk-cell-colored')){
						if($(this).find('.input-text-for-desk-cell').length){
							letter = $(this).find('.input-text-for-desk-cell').val();

						} else {
							letter = $(this).find('.back').text();	
						}
					}

					row.push(letter);
				}
			});
			
			if(row.length){
				aPhrase.push(row);
			}
		});
		
		// тут надо выключить счетчик отгадывания фразы и выключить кнопку
		this.$('#btn-send-phrase').attr('disabled', true);
		clearInterval(window.counter);		
		
		//console.log('Отправляем фразу:', aPhrase);
		
		// отсылаем запрос на сервер
		var builder = ProtoBuf.loadProtoFile('/proto/next.proto');
		var Request = builder.build('WORServer.Api.Game.Next.Request');
		var Response = builder.build('WORServer.Api.Game.Next.Response');
		var buff = Request.encode({
			ApiToken: $.cookie(window.cookieName),
			GameId: window.app.model.game.get('gameId'),
			AnswerCode: 1,
			Rows: aPhrase
		});
		
		$.ajax({
			url: window.urlApi+"/game/next.ashx",
			data: new Uint8Array(buff.toArrayBuffer()),
			success: function(result, status, xhr){
				var obj = Response.decode(new Uint8Array(result));
				
				console.log('Response GameNext', obj);
				
				// закроем назад (брать input-ы и перевернуть обратно ячейки)
				window.app.view.desk.closeDeskCellNotGuess();
				
//				Playing = 0; 
//				Winner = 1; 
//				Loser = 2; 
//				BonusGame = 3;
				if (obj.Game.Status === 1 || obj.Game.Status === 2 || obj.Game.Status === 3) {
					// обновим табло, чтоб были актуальные данные
					window.app.model.top_panel.set({
						round: obj.Game.CountStep,
						xod: obj.Game.CountLives,
						points: obj.Game.CountScore
					});
					
					if(obj.Game.Status === 1){
						that.showWinLose(1);
				
					} else if(obj.Game.Status === 2) {
						that.showWinLose(1);

					} else if(obj.Game.Status === 3) {
						alert('BonusGame');
					}
					
					// узнаем что включать по поводу алфивита
					//window.app.view.alphabit.onOffAlphabit('on');
//					window.app.view.alphabit.onOffConsonants(obj.Game.IsConsonantsAvailable? 'on': 'off');
//					window.app.view.alphabit.onOffVowels(obj.Game.IsVowelsAvailable? 'on': 'off');
//					window.app.view.game.$('#btn-ask-phrase').attr('disabled', !obj.Game.IsWordAvailable);
//					window.app.view.game.$('#btn-go-next').attr('disabled', !obj.Game.IsRotateAvailable);
//					
//					// покажем колесо
//					if (obj.Game.IsAnimateWheel) {
//						setTimeout(function(){
//							window.app.view.game.$('#popupWheel').modal('show').one('shown.bs.modal', function(){
//								window.app.view.game.spinStart();
//								window.app.view.wheel.selected_sector = obj.Game.SectorIndex;
//							});
//						}, window.timeoutAfterOpenChar);
//					}
					
				} else {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
				}
			}
		});
	},
	showWinLose: function(is_win)
	{
		var $modal = this.$('.modal-result-msg');
		
		// выключим алфавит
		// window.app.view.alphabit.onOffAlphabit('off');
		
		$modal.each(function(){
			$(this).find('.modal-result-msg-cell').css({
				width: $(this).width()+'px',
				height: $(this).height()+'px'
			});
		});
		
		// остановим фоновую музыку
		doSound('fon', 'stop');
		
		if (is_win) {
			//window.isTakePrize = true;
			$modal.find('.text-lose').hide();
			doSound('final-win');
			showConfetti(); // запустим конфети
			$modal.css("background-color", "transparent");
			
		} else {
			//window.isTakePrize = false;
			$modal.find('.text-win').hide();
			doSound('final-lose');
		}
		
		// тут показать очки
		//window.userPoints = window.app.model.top_panel.get('speed_bonus') + window.app.model.top_panel.get('points');
		
		// покажем сообщение
		$modal.show();
		
		setTimeout(function(){
			window.location.href="/main_menu";
			
		}, window.app.model.game.get('time_show_alert_when_end_game'));
	},
	inviteFriends: function()
	{
		FB.ui({method: 'apprequests',
			message: 'Wheel Of Resources'

		}, function(response){
			if (response.to.length === 0) {
				return;
			}
			
			var builder = ProtoBuf.loadProtoFile('/proto/invitefriend.proto');
			var Request = builder.build('WORServer.Api.User.InviteFriend.Request');
			var Response = builder.build('WORServer.Api.User.InviteFriend.Response');
			var buff = Request.encode({
				ApiToken: $.cookie(window.cookieName),
				Friends: response.to.join(",")
			});
			
			$.ajax({
				url: window.urlApi+"/user/invitefriend.ashx",
				data: new Uint8Array(buff.toArrayBuffer()),
				success: function(result, status, xhr){
					var obj = Response.decode(new Uint8Array(result));	
					
					console.log('Response InviteFriend', obj);

//					Good = 0; 
//					Fail = 1; 
//					NotEnoughMoney = 2; 
//					AlreadyPlaying = 3; 
//					TimeLimit = 4;
					if(obj.Status === 1){
						showErrorMsg('Invite Friends, Status: fail');
					}
				}
			});
		});
	}
});