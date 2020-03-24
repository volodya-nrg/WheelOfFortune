<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div class="bg-dark-half">
					<a href="/prizes">back</a>
					<span class="pull-right text-white"> 
						<img align="absmiddle" height="20" src="/img/coin.png" />
						&nbsp;
						<%- userPoints %>
					</span>
				</div>	
			</div>
		</div>	
	</div>
	<br />
	<div class="row">
		<div class="col-xs-12">	
			<h2 class="my-h2">Confirm selection of the prize</h2>
		</div>
	</div>	
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div class="bg-dark-half">
					<div class="row">
						<div class="col-xs-12 col-sm-4">
							<img class="img-thumbnail img-responsive" src="<%- urlImage %>" />
							<div class="visible-xs">
								<br />
							</div>
						</div>
						<div class="col-xs-12 col-sm-8">
							id: <%- id %>
							<br />
							name: <%- name %>
							<br />
							price: <%- price %> $
							<br />
							description: <%- description %>
						</div>
					</div>
				</div>
			</div>
		</div>	
	</div>
	<br />
	<div class="row">
		<div class="col-xs-12 text-center">
			<button id="btn-ok" class="btn my-btn-success my-btn-min">Buy</button>
			&nbsp;&nbsp;&nbsp;
			<a class="btn my-btn-default my-btn-min" href="/prizes">Cancel</a>
		</div>
	</div>	
</div>
<br />
<br />