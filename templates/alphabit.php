<% _.each(data.aAlphabit, function(val0){ %>
	<div class="alphabit-row">
		<% _.each(val0, function(val){ %>
			<% if(_.indexOf(data.aVowels, val) != -1){ %>
				<div class="alphabit-item alphabit-vowel disabled" symbol="<%- val %>" >
					<span><%- val %></span>
				</div>

			<% } else { %>
				<div class="alphabit-item alphabit-consonants" symbol="<%- val %>">
					<span><%- val %></span>
				</div>
			<% } %>
		<% }); %>
	</div>
<% }); %>