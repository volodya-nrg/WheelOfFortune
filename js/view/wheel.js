var WheelView = Backbone.View.extend({
	el: '#wheel',
	events: {
		//'mousedown .wheel-wraper': "goToStartMove"
		//'mouseup .wheel-wraper': "goToStopMove"
	},
	
	initialize: function()
	{
		this.template = _.template($('#wheel-tpl').html(), {variable: 'data'})({
			aSectors: this.model.get('aWheelValues')
		});
		this.send_request_on_server = 0;
		this.selected_sector = null;
		this.is_spining = false;
		this.angle_old = 0;
		this.deg = 0;
		this.save_number_point = 0;
		this.tmp_game_info = null; // временные данные для будущей проверки (Банкрот и т.д.)
	},
	render: function()
	{
		this.$el.html(this.template);
		
		var $sectors = this.$('.wheel-sector');
		var total_sectors = $sectors.length;
		var deg = 0;
		var angle = 360/total_sectors;
		
		/* повернем сектора на нужный градус */
		$sectors.each(function(){
			$(this).css('transform', 'rotate('+deg+'deg)');
			deg += angle;
		});
		
		// нужно раставить дополнительные наклейки на барабан
		// console.log(this.aWheelValues);
//		var tmpKey = getRandomKeyFromArray(this.aWheelValues);
//		var keyAirbag = tmpKey;
//		$sectors.eq(tmpKey).find('.wheel-sector-text-wraper').prepend('<div class="wheel-sector-icon airbag"></div>');
//		var tmpKey = getRandomKeyFromArray(this.aWheelValues, ["Bankrupt", this.aWheelValues[keyAirbag]]);
//		$sectors.eq(tmpKey).find('.wheel-sector-text-wraper').prepend('<div class="wheel-sector-icon lucky"></div>');
//		var tmpKey = getRandomKeyFromArray(this.aWheelValues, ["Bankrupt", "Gift", this.aWheelValues[keyAirbag]]);
//		$sectors.eq(tmpKey).find('.wheel-sector-text-wraper').prepend('<div class="wheel-sector-icon prize"></div>');
		
		// если игра уже началась, то добавим соответствующий класс
		if (window.gameAlreadyPlaying === true) {
			this.$('.wheel-wraper').addClass('game-is-started');
		}
		
		return this;
	},
	startRotate: function()
	{
		// установим начальные параметры
		var timing = 'ease-in';
		var time = this.model.get('wheelAnimationTime')/2;
		var tmp_deg = 360; // так же прибавим угол каторый крутанул прользователь в первый раз
		var that = this;
		
		// выключим алфавит
		//window.app.view.alphabit.onOffAlphabit('off');
		
		// если от сервера пришло название назначенного сектора, то установим и начнем останавливать барабан
		if (this.selected_sector !== null) {
			// переназначим
			timing = 'ease-out';
			time = this.model.get('wheelAnimationTime')/2;
			var angle = this.getAngle();
			tmp_deg -= angle - this.angle_old; // идет просчет относительно предворительного значения
			this.angle_old = angle;
			
		} else if(this.is_spining) {
			timing = 'linear';
		}
		
		this.deg += tmp_deg;
		this.is_spining = true; // до проверки на linear - } else if(this.is_spining) {
		
		// запустим колесо как требуется отрежима
		var rotate_str = 'rotate(' + this.deg + 'deg)';
		this.$('.wheel-wraper').css({
			'-webkit-transform':  rotate_str, 
			'-moz-transform':     rotate_str,
			'-ms-transform':      rotate_str,
			'-o-transform':       rotate_str,
			transform:      	  rotate_str,
			transition: 'all '+time+'ms '+timing
		});
		
		// если происходит остановка, то выставим значения по умолчанию
		if(this.selected_sector !== null){
			// запустим код, каторый сработает ровно тогда, когда остановится колесо
			setTimeout(function(){ 
				// переключим ключ
				that.is_spining = false;
				that.send_request_on_server = 0;
				
				// включим алфавит
				//window.app.view.alphabit.onOffAlphabit('on');
				
				var sector_val = $.trim(that.$('.wheel-sector').eq(that.selected_sector)
															   .find('.wheel-sector-text-wraper').text());
				var cur_points = window.app.model.top_panel.get('points');
				
				// Условия пополнения текущих очков
				switch(that.selected_sector){
					case 10: //'Lose Turn'
						// если активированна подушка безопасности, то ни чего не делаем
						var $tmp = window.app.view.game.$('.icon-circle-airbag');
						
						doSound('bankrot');
						
						if($tmp.hasClass('disabled') === false){
							$tmp.addClass('disabled');
						
						} else {
							var xod = window.app.model.top_panel.get('xod');

							if(xod <= 0){
								window.app.view.game.showWinLose(0);
								return;

							} else {
								window.app.view.game.spinStart();
								window.app.view.wheel.selected_sector = obj.Game.SectorIndex;
								return;
							}
						}

						break;
					case 11: //'Disaster':
//						window.app.model.top_panel.set({
//							round: obj.Game.Runtime.CountStep,
//							xod: obj.Game.Runtime.CountLives,
//							points: obj.Game.Runtime.CountScore
//						});
						//window.app.model.top_panel.set('points', Math.round(cur_points * (1 - 0.9)));
						break;
					case 12: //'Rnd':
						//var x = getRandomInt(0, 1)? cur_points + 10000: 0;
						//window.app.model.top_panel.set('points', x);
						break;
					case 13: //'Gift':
						window.app.view.game.$('.icon-circle-prize').removeClass('disabled');
						break;
					case 14: //Airbag:
						window.app.view.game.$('.icon-circle-airbag').removeClass('disabled');
						break;
					default:
						that.save_number_point = parseInt(sector_val);
						break;
				}
				
				// покажем пользователю что выпало на колесе в игровом поле
				window.app.view.game.$('#current-bit').text(sector_val);
				// закроем поп-ап колеса
				setTimeout(function(){
					window.app.view.game.$('#popupWheel').modal('hide');	
				}, 1000);
				// если на сеторе есть обложка, нужно узнать ее и подсвятить нужную иконку на поле
				var $icon = that.$('.wheel-sector').eq(that.selected_sector).find('.wheel-sector-icon');
				
				if($icon.length){
					var tmp = "";
					
					if($icon.hasClass("prize")){
						tmp = "prize";
						doSound('prize');
						
					} else if($icon.hasClass("airbag")) {
						tmp = "airbag";
					
					} else if($icon.hasClass("lucky")) {
						tmp = "lucky";
					}
					
					if(tmp !== ""){
						var $tmpObj = window.app.view.game.$('.icon-circle-'+tmp);
						
						// если это приз и он выпал дважды, то перейдем к супер игре
						if(tmp === "prize" && !$tmpObj.hasClass("disabled")){
							alert('Супер игра');
							
						} else {
							$tmpObj.removeClass('disabled');
						}
					}
				}
				
			}, time);
			
			return;
		}

		if (this.send_request_on_server === 0) {
			this.send_request_on_server = 1;
			
			// если это первое вращение колеса, то стартуем запланированную игру
			if (_.isNull(window.app.model.game.get('gameId'))) {
				var builder = ProtoBuf.loadProtoFile('/proto/start.proto');
				var Request = builder.build('WORServer.Api.Game.Start.Request');
				var Response = builder.build('WORServer.Api.Game.Start.Response');
				var buff = Request.encode({
					ApiToken: $.cookie(window.cookieName)
				});

				$.ajax({
					url: window.urlApi+"/game/start.ashx",
					data: new Uint8Array(buff.toArrayBuffer()),
					success: function(result, status, xhr){
						var obj = Response.decode(new Uint8Array(result));	
						
						console.log("Response Start", obj);
						
//						Good = 0;
//						Fail = 1;
//						NotEnoughMoney = 2;
//						AlreadyPlaying = 3;
//						TimeLimit = 4;
						if(obj.Status === 0){
							window.app.model.game.set('gameId', obj.GameId);
							that.getGameInfo();
							
						} else {
							window.app.view.game.$('#popupWheel').modal('hide');
							showErrorMsg('Game Start, Status: '+obj.Status+'; Msg: '+obj.Message);
							clearTimeout(window.timeoutRotateWheel);
						}
					}
				});		
			}
		}
		
		// выполним еще раз эту ф-ию через промежуток времени
		window.timeoutRotateWheel = setTimeout(function(){ 
			that.startRotate();
		}, time);
	},
	getGameInfo: function() 
	{
		var that = this;
		
		// получаем данные об игре
		var builder = ProtoBuf.loadProtoFile('/proto/info.proto');
		var Request = builder.build('WORServer.Api.Game.Info.Request');
		var Response = builder.build('WORServer.Api.Game.Info.Response');
		var buff = Request.encode({
			ApiToken: $.cookie(window.cookieName),
			GameId: window.app.model.game.get('gameId')
		});

		$.ajax({
			url: window.urlApi+'/game/info.ashx',
			data: new Uint8Array(buff.toArrayBuffer()),
			success: function(result, status, xhr){
				// сохраним текущие данные, чтоб после остановки колеса еще проверить
				var obj = that.tmp_game_info = Response.decode(new Uint8Array(result));

				console.log('Response GameInfo', obj);
				
//				Good = 0; 
//				Fail = 1; 
//				NotEnoughMoney = 2; 
//				AlreadyPlaying = 3; 
//				TimeLimit = 4;
				if(obj.Status === 0 || obj.Status === 2 || obj.Status === 3){
					// установим текущие очки, установим текущую попытку
					window.app.model.top_panel.set({
						round: obj.Game.Runtime.CountStep,
						xod: obj.Game.Runtime.CountLives,
						points: obj.Game.Runtime.CountScore
					});
					
					// установим тему
					if (window.app.model.game.get("theme") === "") {
						window.app.model.game.set("theme", obj.Game.Question.QuestionText);
					}
					
					// установим нужный сектор
					that.selected_sector = obj.Game.Runtime.SectorIndex;
					
					// если ячейки еще не обозначены для отгадывания, то обозначим
					if (window.app.model.desk.get('availableCells').length === 0) {
						var aReciver = [];
						for(var i=0; i<obj.Game.Question.AvailableCells.length; i++){
							aReciver.push(obj.Game.Question.AvailableCells[i].Available);
						}
						window.app.model.desk.set('availableCells', aReciver);
					}
					
					// подхватим уже открытые ячейки (условий не создавать)
					var aReciver = [];
					for(var i=0; i<obj.Game.Runtime.Letters.length; i++){
						aReciver.push(obj.Game.Runtime.Letters[i].CurrentOpenedChars);
					}
					window.app.model.desk.set('currentOpenedChars', aReciver);
					
					// узнаем что включать по поводу алфивита
					//window.app.view.alphabit.onOffAlphabit('on');
					window.app.view.alphabit.onOffConsonants(obj.Game.Runtime.IsConsonantsAvailable? 'on': 'off');
					window.app.view.alphabit.onOffVowels(obj.Game.Runtime.IsVowelsAvailable? 'on': 'off');
					window.app.view.game.$('#btn-ask-phrase').attr('disabled', !obj.Game.Runtime.IsWordAvailable);
					window.app.view.game.$('#btn-go-next').attr('disabled', !obj.Game.IsRotateAvailable);
					
					// запустим счетчик	
					window.app.view.game.startTimer(obj.Game.Runtime.TimeLeft);
					
					// если игра уже была запущена, то сразу выставим нужные значения и сразу уберем этот ключ
					if (window.gameAlreadyPlaying === true) {
						window.gameAlreadyPlaying = false;
						
						// установим "current bit"
						var sector_val = $.trim(that.$('.wheel-sector').eq(that.selected_sector)
															   .find('.wheel-sector-text-wraper').text());
						window.app.view.game.$('#current-bit').text(sector_val);
						
						// сразу выставим ранее нажатые символы букв
						for (var i=0; i<obj.Game.Runtime.PressedLetters.length; i++){
							window.app.view.alphabit.deactivateLetter(obj.Game.Runtime.PressedLetters[i]);
						}
					}
						
				} else {
					showErrorMsg('Status: '+obj.Status+'; Msg: '+obj.Message);
				}
			}
		});
	},
	getAngle: function()
	{
		var diameter = this.$('.wheel-wraper').width();
		var total_sectors = this.$('.wheel-sector').length;
		var l = Math.round(diameter * Math.PI);
		var w_sector = Math.round(l / total_sectors);
		var w_dop = getRandomInt(0, Math.floor(w_sector/2)-5); // для правдоподобности выставим случайные еще расстояние
		var znak = getRandomInt(0, 1)? -1: 1;
		var lx = w_sector * this.selected_sector;
		lx += znak * w_dop;
		
		var percent = Math.round((100 * lx) / l);
		var angle = Math.round(360 * (percent/100));
		
		return angle;
	},
//	goToStartMove: function(event)
//	{
//		if (window.app.model.game.get('gameId') !== null) {
//			return;
//		}
//		
//		this.model.set('isStartedMove', true);
//		this.model.set('firstPointX', event.pageX);
//	},
//	goToStopMove: function()
//	{
//		// ф-ия работает только тогда когда было касание, иначе выходим
//		if (this.model.get('isStartedMove') === false) {
//			return;
//		}
//		
//		this.model.set('isStartedMove', false);
//		this.model.set('firstPointX', 0);
//		
//		// если ни на один градус не крутанули колесо, то выходим
//		if (window.angleWheelOnStartGame < 1) {
//			return;
//			
//		} else {
//			window.angleWheelOnStartGame = 0;
//		}
//		
//		window.app.view.wheel.$('.wheel-wraper').addClass('game-is-started');
//		window.app.view.game.$('#btn-spin-start').click();
//	}
});