<div class="bg-dark-wall"></div>

<div class="modal-result-msg">
    <div class="modal-result-msg-cell">
        <span class="text-win text-light-yellow">
            <div class="text-win-header">
                    YOU’RE A WINNER!
            </div>
            <p>
				Need help with your Human Resources? 
				Visit us at <a href="http://www.modernhr4u.com">www.modernhr4u.com</a> <insert prize claim instructions>
            </p>
        </span>
        <span class="text-lose text-light-red">
            <div class="text-lose-header">
                Sorry you’re not a winner today!
                <br />
                Come back tomorrow for another chance to win!
            </div>
            <br />
            <p>
				Sounds like you might benefit from some help with Modern HR. 
				Visit us at <a href="http://www.modernhr4u.com">www.modernhr4u.com</a>
            </p>
        </span>
    </div>
</div>

<!--top pnel-->
<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div id="top-panel" class="bg-dark-half text-uppercase"></div>	
			</div>
		</div>
	</div>
</div>

<!--desk-->
<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="border-light">
				<div id="desk" class="bg-dark-half"></div>
			</div>
		</div>
	</div>
</div>

<!--theme-->
<br />
<div class="container">
	<div class="row text-light text-uppercase">
		<div class="col-xs-8 text-left">
			<font size="+1">
				Question: <span id="theme-title"><%- theme %></span>
				<br />
				Answer: Resignation or retirement
			</font>
		</div>
		<div class="col-xs-4 text-right">
			<font size="+1">
				Current bit: <span id="current-bit"></span>
			</font>
		</div>
	</div>
</div>

<!--alphabit-->
<br />
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div id="alphabit" class="locked"></div>
		</div>
	</div>
</div>

<!--buttons-->
<br />
<br />
<div class="container">
	<div class="row">
		<div id="game-bottom-btns" class="col-xs-7">
			<button id="btn-invite-friends" class="btn my-btn-primary" >Invite friend</a>
			<button id="btn-ask-phrase" class="btn my-btn-success" disabled >Ask phrase</button>
			<button id="btn-send-phrase" class="btn my-btn-danger" disabled >Send phrase</button>
			<button id="btn-go-next" class="btn my-btn-warning" disabled >Go Next</button>
		</div>
		<div id="icon-circles" class="col-xs-5 text-right">
			<div class="icon-circle icon-circle-lucky disabled"></div>
			<div class="icon-circle icon-circle-prize disabled"></div>
			<div class="icon-circle icon-circle-airbag disabled"></div>
		</div>
	</div>
</div>

<!--wheel-->
<div id="popupWheel" class="modal fade" tabindex="-1">
	<div class="modal-dialog ">
		<div class="modal-content border-light bg-dark-half">
			<div class="modal-body text-center">
				<div id="wheel"></div>
				<button id="btn-spin-start" class="btn my-btn-primary btn-block" onclick="$(this).hide()">Spin</button>	
			</div>
		</div>
	</div>
</div>