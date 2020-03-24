<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div class="bg-dark-half">
					<a href="/main_menu">back</a>
					<span class="pull-right text-white"> 
						<img align="absmiddle" height="20" src="./img/coin.png" />
						&nbsp;
						<%- points %>
					</span>
				</div>	
			</div>
		</div>
	</div>
	<br />
	<br />
	<div class="row">
		<div class="col-xs-12">
			<div id="section-prizes">
				<div class="slick">
					<% _.each(list.toArray(), function(model){ %>
						<a class="prize-item border-light" href="/prizes/<%- model.get('id') %>">
							<div class="prize-item-wraper bg-dark-half">
								<img class="img-thumbnail img-responsive" src="<%- model.get('urlImage') %>" />
								<br />
								<%- model.get('name') %>
							</div>
						</a>
					<% }); %>
				</div>
			</div>
		</div>
	</div>
</div>