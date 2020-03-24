$(function(){
	if($(".slider").length){
		$(".slider").each(function(){
			var $handle = $(this).find(".custom-handle");
			
			$(this).slider({
				value: ($handle.hasClass('fx-music')? volumeFxMusic: volumeFxSounds) * 100,	
				create: function() {
					//$handle.text( $(this).slider("value") );
				},
				slide: function( event, ui ) {
					//$handle.text(ui.value);
					var selector = "fx-music";
					var vol = ui.value/100;
					
					// если меняют звук музыки фона, иначе звуки
					if ($handle.hasClass(selector)) {
						window.volumeFxMusic = vol;
						window.aSounds[0].volume = window.volumeFxMusic;
						
					} else {
						selector = 'fx-sounds';
						window.volumeFxSounds = vol;
						
						for (var key in window.aSounds) {
							// нулевой пропускаем, т.к. это фоновая музыка
							if (key == 0) {
								continue;
							}
							
							window.aSounds[key].volume = window.volumeFxSounds;
						}
					}
					
					$.cookie(selector, vol, {expires: 365, path: '/'});
				}
			});
		});
	}
	if($('.modal-result-msg').length){
		$('.modal-result-msg > .modal-result-msg-cell').css({
			width: $(window).width()+'px',
			height: $(window).height()+'px'
		});
	}
	if($('.friend-item').length){
		$('.friend-item').on('click', function(){
			$(this).find('.friend-item-check').toggle();	
		});
	}
	
	// подгрузим соответствующий задний фон, исходя из размера ширины браузера
	var tmpImg = new Image;
	tmpImg.onload = function(){
		$('#body-public').css('background-image', 'url('+ this.src +')');
	};
	tmpImg.src = ($(window).width() <= 800)? "/img/bg-sm.jpg": "/img/bg-lg.jpg";
	
	// событие на движение вращения пользователем колеса
	/*$(window).mousemove(function(event){
		if(	
				(_.isUndefined(window.app.model.wheel) === false) && 
				(_.isUndefined(window.app.view.wheel) === false) && 
				(window.app.model.wheel.get('isStartedMove') === true) &&
				(window.app.view.wheel.$('.wheel-wraper').hasClass('game-is-started') === false)
			){
			window.angleWheelOnStartGame = window.app.model.wheel.get('firstPointX') - event.pageX;
			window.angleWheelOnStartGame *= -1; // сделаем положительное число 
			var rotate_str = 'rotate('+ window.angleWheelOnStartGame +'deg)';
			
			if (window.angleWheelOnStartGame > 0) {
				$('.wheel-wraper').css({
					'-webkit-transform':  rotate_str, 
					'-moz-transform':     rotate_str,
					'-ms-transform':      rotate_str,
					'-o-transform':       rotate_str,
					transform:      	  rotate_str,
					transition:			  'none'
				});
			}	
		}
	});
	$(window).mouseup(function(){
		if (
				(_.isUndefined(window.app.model.wheel) === false)		&& 
				(_.isUndefined(window.app.view.wheel) === false)		&& 
				window.app.model.wheel.get('isStartedMove') === true	&& 
				window.angleWheelOnStartGame > 0
																			) {
			window.app.model.wheel.set('isStartedMove', false);
			window.app.model.wheel.set('firstPointX', 0);
			window.app.view.wheel.$('.wheel-wraper').addClass('game-is-started');
			window.app.view.game.$('#btn-spin-start').click();
		}
	});*/
	doSound('fon');
});

/*
 * обязательное использование protobuf
 */
if (typeof dcodeIO === undefined || !dcodeIO.ProtoBuf || !dcodeIO.ByteBuffer) {
	throw(new Error("ProtoBuf.js is not present. Please see for manual setup instructions."));
}

/*
 * зададим осн. переменные 
 */
var app = app || {};
	app.model = {};
	app.view = {};
	app.router = {};
	app.col = {};
var counter = null;
var counterInt = 0;
var counter_timer_na_speed_bonus = null;
var urlApi = "http://artech.mobi/WORServer/api";
var ProtoBuf = dcodeIO.ProtoBuf;
var ByteBuffer = dcodeIO.ByteBuffer;
var cookieName = "my_cookie";
var gameId = null;
var gameAlreadyPlaying = false;
var onFB = (window.location.hostname === 'wheel' || window.location.hostname === 'localhost'? false: true);
var isAuthInFB = false;
var userPoints = 0;
var isTakePrize = false;
var timeoutAfterOpenChar = 2000;
var timeDelayErrMsg = 5000;
var wheelIsReadyForMove = false;
var angleWheelOnStartGame = 0;
var timeoutRotateWheel = null;
var aSounds = [];
var volumeFxMusic = !_.isUndefined($.cookie("fx-music"))? $.cookie("fx-music"): 0;
var volumeFxSounds = !_.isUndefined($.cookie("fx-sounds"))? $.cookie("fx-sounds"): 0.75;
var GameWaitTimeLeft = 0; // время окончания игры
var timeend = new Date();
/*
 * установим свои настройки передачи данных
 */
$.ajaxSetup({
	dataType: "binary",
	processData: false,
	responseType: 'arraybuffer',
	type: "POST"
});
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

window.fbAsyncInit = function() {
	if (window.onFB === false) {
		auth(null);
		
	} else {
		FB.init({
			appId: '1785493308371493',
			status: false, // default false, если выключен, то идет ручная проверка через getLoginStatus()
			cookie: true, // default false, создавать куки или нет
			xfbml: true, // default false, происходит ли анализ тегов xfbml
 			version: 'v2.9'
		});
		
		FB.getLoginStatus(function(response) {
			// если пользователь авторизовался в FB, то запустим нормально игру
			// иначе не пустим дальше
			//console.log("FB:", response);
			
			if (response.status === 'connected') {
				window.isAuthInFB = true;
				
				// изнаем информацию о пользователе
				FB.api('/me', { locale: 'en_US', fields: 'name, email' }, function(responseMe){
					response.me = responseMe;
					auth(response);
				});
				
			} else {
				window.app.router.public = new PublicRouter({
					routes: {
						''		: 'index',
						':id'	: 'index'
					}
				});

				if(window.app.view.index !== undefined){
					// покажем кнопку "Авторизоваться через FB"
					window.app.view.index.$('#index_btn_auth_fb').show();
					// спрячем кнопку "В меню"
					window.app.view.index.$('#index-btn-play').hide();
				}
			}
		});
	}
};
(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// кастомные ф-ии
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function auth(FBresponse){
	//console.log('window.cookieName = '+$.cookie(window.cookieName));
	//console.log('FB response = ', FBresponse);
	
	var FbUserId = (FBresponse === null? "10": FBresponse.authResponse.userID);
	var FbAccessToken = (FBresponse === null? "4": FBresponse.authResponse.accessToken);
	var FbUserEmail = (FBresponse === null? "": (_.isUndefined(FBresponse.me.email)? "": FBresponse.me.email));
	var builder = ProtoBuf.loadProtoFile('/proto/auth.proto');
	var Request = builder.build('WORServer.Api.Auth.Request');
	var Response = builder.build('WORServer.Api.Auth.Response');
	var buff = Request.encode({
		Social: 0,
		UserId: FbUserId,
		AccessToken: FbAccessToken,
		Email: FbUserEmail
	});

	//console.log('отправляем запрос на авторизацию ('+ FbUserId +', '+ FbAccessToken +')');
	$.ajax({
		url: window.urlApi+"/auth.ashx",
		data: new Uint8Array(buff.toArrayBuffer()),
		success: function(result, status, xhr){
			var obj = Response.decode(new Uint8Array(result));

			console.log('Response Auth', obj);
			
			if(obj.Status === 0){
				// установим куки
				$.cookie(window.cookieName, obj.ApiToken, {expires: 365, path: '/'});
				
				// если пользователь обновил страницу
				builder = ProtoBuf.loadProtoFile('/proto/user_info.proto');
				Request = builder.build('WORServer.Api.User.Info.Request');
				Response = builder.build('WORServer.Api.User.Info.Response');
				buff = Request.encode({
					ApiToken: $.cookie(window.cookieName)
				});

				//console.log('отправляем запрос на получение данных о пользователе');
				$.ajax({
					url: window.urlApi+"/user/info.ashx",
					data: new Uint8Array(buff.toArrayBuffer()),
					success: function(result, status, xhr){
						var obj = Response.decode(new Uint8Array(result));

						console.log('Response UserInfo', obj);

						window.userPoints = obj.User.Score;
						window.isTakePrize = obj.User.IsTakePrize;
						window.GameWaitTimeLeft = obj.User.GameWaitTimeLeft;
						
						// если есть id игры, то переключим пользователя на игру, чтоб продолжить игру
						if (obj.User.GameId > 0) {
							window.gameId = obj.User.GameId;
							window.gameAlreadyPlaying = true;
							//console.log("window.gameIsPlaying = "+window.gameIsPlaying);

							// запустим роутер
							window.app.router.public = new PublicRouter();
							redirectTo("/game");
							
						} else {
							// запустим роутер
							window.app.router.public = new PublicRouter();
						}
					}
				});
				
			} else {
				showErrorMsg(obj.Message);
			}
		}
	});
}
function redirectTo(url){
	window.app.router.public.navigate(url, {trigger: true});
}
function showErrorMsg(msg){
	$('#error-msg').text(msg).show(0).delay(window.timeDelayErrMsg).fadeOut();
}
function doAnimateIconFromWheelToBottom(selector){
	var centerX = Math.round($(window).width()/2);
	var centerY = 266;
	var $donar = $(selector)[0];
	var $clone = $(selector).clone();
	
	$clone.css({
		position: 'absolute',
		top: centerY + 'px',
		left: centerX + 'px',
		'z-index': 1051,
		display: 'none'
	});
	$('body').append($clone);
	
	$clone.fadeIn()
		.animate({
			top: ($donar.offsetParent.offsetTop + $donar.offsetTop) + 'px',
			left: ($donar.offsetParent.offsetLeft + $donar.offsetLeft) + 'px',	
		}, 2000, function(){
			$(selector).removeClass('disabled');
		})
		.fadeOut('normal', function(){
			$(this).remove();
		});
}
function doSound(opt, isStop){
	/* fone - фоновая музыка
	 * baraban - звук кручения барабана
	 * char_win - победа, угадал букву
	 * char_lose - ошибка, не угадал букву
	 * prize - выпал приз
	 * bankrot - выпал банкрот
	 * final_win - финальная победа
	 * final_lose - финальное поражение
	 */
	
	var file = "";
	var key = 0;
	
	switch (opt) {
		case "fon":
			file = "WOF_Theme.mp3";
			key = 0;
			break;
		case "baraban":
			file = "Wheel_of_fortune_sound.mp3";
			key = 1;
			break;
		case "char-win":
			file = "correct_reacion.mp3";
			key = 2;
			break;
		case "char-lose":
			file = "error_reacion.mp3";
			key = 3;
			break;
		case "prize":
			file = "Prize.mp3";
			key = 4;
			break;
		case "bankrot":
			file = "Error.mp3";
			key = 5;
			break;
		case "final-win":
			file = "Win.mp3";
			key = 6;
			break;
		case "final-lose":
			file = "Fail_short.mp3";
			key = 7;
			break;
		default:
			return false;
			break;
	}
	
	if (_.isUndefined(window.aSounds[key]) ===  false) {
		if (isStop !== undefined) {
			window.aSounds[key].pause();
			
		} else {
			window.aSounds[key].play();
		}
		
	} else {
		var audioElm = new Audio();
		audioElm.src = '/sounds/'+ file;
		audioElm.autoplay = false;
		audioElm.loop = (opt === "fon"? true: false);
		audioElm.volume = (opt === "fon"? window.volumeFxMusic: window.volumeFxSounds);
		
		audioElm.addEventListener('canplaythrough', function(){
			this.play();
		}, false);
		
		window.aSounds[key] = audioElm;
	}
}
function showConfetti(){
	(function() {
		var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

		NUM_CONFETTI = 350;
		COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];
		PI_2 = 2 * Math.PI;
		canvas = document.getElementById("confetti");
		context = canvas.getContext("2d");
		window.w = canvas.width = window.innerWidth;
		window.h = canvas.height = window.innerHeight;

//		resizeWindow = function() {
//			window.w = canvas.width = window.innerWidth;
//			return window.h = canvas.height = window.innerHeight;
//		};

		//window.addEventListener('resize', resizeWindow, false);

//		window.onload = function() {
//			return setTimeout(resizeWindow, 0);
//		};

		range = function(a, b) {
			return (b - a) * Math.random() + a;
		};

		drawCircle = function(x, y, r, style) {
			context.beginPath();
			context.arc(x, y, r, 0, PI_2, false);
			context.fillStyle = style;
			return context.fill();
		};

		xpos = 0.5;

		document.onmousemove = function(e) {
			return xpos = e.pageX / w;
		};

		window.requestAnimationFrame = (function() {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			};
		})();

		Confetti = (function() {
			function Confetti() {
				this.style = COLORS[~~range(0, 5)];
				this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
				this.r = ~~range(2, 6);
				this.r2 = 2 * this.r;
				this.replace();
			}

			Confetti.prototype.replace = function() {
				this.opacity = 0;
				this.dop = 0.03 * range(1, 4);
				this.x = range(-this.r2, w - this.r2);
				this.y = range(-20, h - this.r2);
				this.xmax = w - this.r;
				this.ymax = h - this.r;
				this.vx = range(0, 2) + 8 * xpos - 5;
				return this.vy = 0.7 * this.r + range(-1, 1);
			};

			Confetti.prototype.draw = function() {
				var ref;
				this.x += this.vx;
				this.y += this.vy;
				this.opacity += this.dop;
				if (this.opacity > 1) {
				  this.opacity = 1;
				  this.dop *= -1;
				}
				if (this.opacity < 0 || this.y > this.ymax) {
				  this.replace();
				}
				if (!((0 < (ref = this.x) && ref < this.xmax))) {
				  this.x = (this.x + this.xmax) % this.xmax;
				}
				return drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
			};

			return Confetti;

		})();

		confetti = (function() {
			var j, ref, results;
			results = [];
			for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
				results.push(new Confetti);
			}
			return results;
		})();

		window.step = function() {
			var c, j, len, results;
			requestAnimationFrame(step);
			context.clearRect(0, 0, w, h);
			results = [];
			for (j = 0, len = confetti.length; j < len; j++) {
				c = confetti[j];
				results.push(c.draw());
			}
			return results;
		};
		step();
		
	}).call(this);	
}
function arrayClone(arr){  
	if(_.isArray(arr)) {
		return _.map(arr, arrayClone);
		
	} else if(typeof arr === 'object') {
		throw 'Cannot clone array containing an object!';
		
	} else {
		return arr;
	}
}
function time() {
	var today 	= new Date();
	var today 	= Math.floor((timeend-today)/1000);
	var tsec	= today%60; today=Math.floor(today/60); 
	var tmin	= today%60; today=Math.floor(today/60);
	var thour	= today%24; today=Math.floor(today/24);
	var sDay	= "дней";
	
	if (today <= 0 && thour <= 0 && tmin <= 0 && tsec <= 0) {
		$('#ad').hide();
		
	} else {
		if(tsec<10){
			tsec = '0'+tsec;	
		}
		if(tmin<10){
			tmin = '0'+tmin;	
		}
		
		if(today == 1){
			sDay = "день";	
		
		} else if(today == 0) {
			today = "";
			sDay = "";
		
		} else if(today == 2) {
			sDay = "дня";
		}
		
		var x = $.trim(today +" "+ sDay +" "+ thour+":"+tmin+":"+tsec);
		$('#popup-game-wait-time-left').find('.modal-body').text(x);
		window.setTimeout("time()",1000);
	}
}