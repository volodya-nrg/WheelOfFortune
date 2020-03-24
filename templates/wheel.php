<div class="wheel-metka">
	<img height="50" src="/img/rubin.png" />
</div>
<div class="wheel-wraper">
	<img class="wheel-wraper-main-img" src="/img/wheel.png" />
	<div class="wheel-wraper-main-logo">
		<img align="absmiddle" width="30" height="30" src="/img/logo.png" />
	</div>
	<div class="wheel-center">
		<% if(data.aSectors != undefined && data.aSectors.length){ %>
			<% _.each(data.aSectors, function(val){ %>
				<div class="wheel-sector">
					<div class="wheel-sector-text-wraper" unselectable="on">
						<%- val %>
					</div>
				</div>		
			<% }); %>
		<% } %>
	</div>
</div>