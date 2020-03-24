<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div class="bg-dark-half">
					<a href="/game"><font size="+1">back</font></a>
				</div>	
			</div>
		</div>
	</div>
</div>
<br />
<h1 class="my-h1 text-center">invite friends</h1>
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<br />
			<div class="slick">
				<% if(data.friends != undefined && data.friends.length){ %>
					<% _.each(data.friends, function(model){ %>
						<div class="text-center">
							<div class="friend-item">
								<div class="friend-item-check">
									<i class="fa fa-check-circle fa-4x"></i>
								</div>
								<div class="friend-item-avatar">
									<img height="100" src="<%- model.get('avatar') %>" />
								</div>
								<div class="friend-item-name">
									<%- model.get('name') %>
								</div>
							</div>
							<br />
							<div class="friend-item">
								<div class="friend-item-check">
									<i class="fa fa-check-circle fa-4x"></i>
								</div>
								<div class="friend-item-avatar">
									<img height="100" src="<%- model.get('avatar') %>" />
								</div>
								<div class="friend-item-name">
									<%- model.get('name') %>
								</div>
							</div>
						</div>
					<% }); %>
				<% } %>
			</div>
			<br />
			<center>
				<button class="btn my-btn my-btn-success">Пригласить</button>
				&nbsp;&nbsp;&nbsp;
				<button class="btn my-btn my-btn-pink" 
					data-toggle="modal" 
					data-target="#popup-settings">
					<i class="fa fa-cog fa-fw"></i>
				</button>
				&nbsp;&nbsp;&nbsp;
				<button class="btn my-btn my-btn-pink" 
					data-toggle="modal" 
					data-target="#popupQA">
					<i class="fa fa-question fa-fw"></i>
				</button>
			</center>
			<br />
			<br />
		</div>
	</div>
</div>	