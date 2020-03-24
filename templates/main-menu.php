<div class="bg-dark-wall"></div>
<div class="container">
	<div class="row">
		<div class="col-xs-12 text-center">
			<div id="section-main-menu">
				<img id="logo-under-wheel" src="/img/logo-text-shadow.png" />
				<div class="bg-wheel-abs rotate-8"></div>
				<div class="bg-stars-fx rotate-16"></div>
				<div class="bg-rainbow"></div>
				
				<div class="as-tbl">
					<div class="as-tbl-cell">
						<img class="img-wor-text" src="./img/wor_text.png" />
						<br />
						<br />
<!--						<a class="btn my-btn-success my-btn-lg2x my-btn-min" href="/game">Play</a>-->
							<button id="mainMenuBtnPlay" class="btn my-btn-success my-btn-lg2x my-btn-min">Play</button>
						<br />
						<br />

						<% if(isShowBtnGetPrize === true){ %>
							<a class="btn my-btn-success my-btn-lg my-btn-min" href="/prizes">Get prizes</a>
							<br />
							<br />
						<% } %>			

						<a class="btn my-btn-success my-btn-lg my-btn-min" href="/score">Records</a>
						<br />
						<br />
						<button class="btn my-btn-pink" data-toggle="modal" data-target="#popup-settings">
							<i class="fa fa-cog fa-fw"></i>
						</button>
<!--						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
<!--						<button class="btn my-btn-pink" data-toggle="modal" data-target="#popupQA">
							<i class="fa fa-question fa-fw"></i>
						</button>-->
<!--						<a class="btn my-btn-pink hide" href="/help">
							<i class="fa fa-question fa-fw"></i>
						</a>-->
					</div>
				</div>
			</div>
		</div>
	</div>
</div>