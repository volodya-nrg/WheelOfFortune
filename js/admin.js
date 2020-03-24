$(function(){
	new AdminRouter();
	
//	$('.btn-top-menu').on('click', function(){
//		$('.btn-top-menu').removeClass('active');
//		$(this).addClass('active');
//	});
});

$.fn.drawPrizeTbl = function(){
	if(!window._prize_tbl){
		window._prize_tbl = {};	
	}
	
	var id = Math.random();
	
	$(this).attr('data-prize-tbl-id', id);
	window._prize_tbl[id] = new PrizeTblView({
		el: this
	});
};