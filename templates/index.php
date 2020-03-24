<div class="container">
	<div class="row">
		<div class="col-xs-12 text-center">
			<div id="section-index">
				<img id="logo-under-wheel" src="/img/logo-text-shadow.png" />
				<div class="bg-rainbow"></div>
				<div class="bg-wheel-abs rotate-8"></div>
				<div class="bg-stars-fx rotate-16"></div>
				
				<div class="as-tbl">
					<div class="as-tbl-cell">
						<img class="img-wor-text" src="./img/wor_text.png" />
						<br />
						<br />
						<button id="index-btn-auth-fb" class="btn my-btn-success btn-lg" 
							onclick="FB.login(function(){
								// проверяем автор-ию на FB, если все нормально обновляем данные
								FB.getLoginStatus(function(response) {
									if(response.status === 'connected'){
										window.isAuthInFB = true; // устанавливаем метку для будущего использования
										Backbone.history.stop();
										window.app.router.public = new PublicRouter();
										window.location.href='/main_menu';
									}
								});

							}, {scope: 'public_profile,email'})">Authorization through FB</button>

						<a id="index-btn-play" class="btn my-btn-pink btn-lg" href="/main_menu">Main menu</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>