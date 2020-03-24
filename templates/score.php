<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div class="bg-dark-half">
					<a href="/main_menu">back</a>
				</div>	
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<h1 class="my-h1 text-center">high score</h1>
		</div>
	</div>
	<br />
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div class="bg-dark-half text-white">
					<!-- Nav tabs -->
					<ul class="nav nav-tabs text-uppercase">
						<li class="active"><a href="#score-of-week" data-toggle="tab">top week</a></li>
						<li><a href="#score-of-month" data-toggle="tab">top month</a></li>
						<li><a href="#score-of-all" data-toggle="tab">top all</a></li>
					</ul>

					<!-- Tab panels -->
					<div class="tab-content">
						<div id="score-of-week" class="tab-pane active">
							<table class="table table-condensed">
								<tbody>
									<% if ( _.size(top_week) ) { %>
										<% _.each(top_week.toArray(), function(model){ %>
											<tr>
												<td align="center"><%- model.get('pos') %></td>
												<td align="center"><strong><%- model.get('name') %>1</strong></td>
												<td align="center"><%- model.get('points') %></td>
											<tr>	
										<% }); %>
									<% } else { %>
										<tr>
											<td colspan="3">пусто</td>
										</tr>
									<% } %>
								</tbody>
							</table>
						</div>
						<div id="score-of-month" class="tab-pane">
							<table class="table table-condensed">
								<tbody>
									<% if( _.size(top_month) ){ %>
										<% _.each(top_month.toArray(), function(model){ %>
											<tr>
												<td align="center"><%- model.get('pos') %></font></td>
												<td align="center"><strong><%- model.get('name') %>2</strong></td>
												<td align="center"><%- model.get('points') %></td>
											<tr>	
										<% }); %>
									<% } else { %>
										<tr>
											<td colspan="3">пусто</td>
										</tr>	
									<% } %>
								</tbody>
							</table>
						</div>
						<div id="score-of-all" class="tab-pane">
							<table class="table table-condensed">
								<tbody>
									<% if( _.size(top_all) ){ %>
										<% _.each(top_all.toArray(), function(model){ %>
											<tr>
												<td align="center"><%- model.get('pos') %></td>
												<td align="center"><strong><%- model.get('name') %>3</font></td>
												<td align="center"><%- model.get('points') %></td>
											<tr>	
										<% }); %>
									<% } else { %>
										<tr>
											<td colspan="3">пусто</td>
										</tr>
									<% } %>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>	
			<br />
			<center>
				<a class="btn my-btn-success my-btn-min" href="/main_menu">OK</a>
			</center>
			<br />
			<br />
		</div>
	</div>
</div>