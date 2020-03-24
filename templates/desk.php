<? for($i = 0; $i<4; $i++): ?>
	<div class="desk-row">
		<? for($j = 0; $j<14; $j++): ?>
			<? $is_empty = ((!$i || $i==3) && (!$j || $j == 13))? true: false; ?>

			<div class="desk-cell <?= $is_empty? 'desc-cell-empty': '' ?>">
				<? if(!$is_empty): ?>
					<div class="desk-cell-absolute desk-cell-mask front"></div>
					<div class="desk-cell-absolute desk-cell-char back"></div>
				<? endif; ?>
			</div>
		<? endfor; ?>
	</div>	
<? endfor; ?>