var DeskView = Backbone.View.extend({
	el: '#desk',
	template: _.template($('#desk-tpl').html()),
	secret_phrase: [],
	
	events: {
		'blur .input-text-for-desk-cell': 'blurInputText',	
		'focus .input-text-for-desk-cell': 'focusInputText'
	},
	initialize: function()
	{
		this.listenTo(this.model, 'change:availableCells', this.drawAvailableCells);
		this.listenTo(this.model, 'change:currentOpenedChars', this.updateOpenedChars);
	},
	render: function()
	{
		this.$el.html(this.template);
		this.drawAvailableCells();
		
		return this;
	},
	/*
	 * ф-ия открывает открытые ячейки
	 */
	updateOpenedChars: function()
	{
		//console.log('отработал - updateOpenedChars()');
		var currentOpenedChars = this.model.get('currentOpenedChars');
		var offset_row = (currentOpenedChars.length === 1 || currentOpenedChars.length === 2)? 1: 0;
		var pos = 0;

		for (i=0, iSrc=0; i<4; i++) {
			total_cells = (i === 0 || i === 3)? 12: 14;
			
			// если строк меньше чем 4, то переместим слова на нижнию строчку
			if (offset_row && !i) {
				pos += total_cells;
				continue;
			}
			if (currentOpenedChars[iSrc] === undefined) {
				continue;
			}

			var offset_cel = Math.floor((total_cells - currentOpenedChars[iSrc].length)/2);
			pos += offset_cel;
			for (j=0; j<currentOpenedChars[iSrc].length; j++) {
				char = currentOpenedChars[iSrc][j];

				if(char !== ""){
					var $el = this.$('.desk-cell:not(.desc-cell-empty)').eq(pos);

					if ($el.hasClass('desk-cell-guess') === false) {
						// запишем значение
						$el.find('.back').text(char);
						// повернем ячейку
						$el.flip('toggle');
						// установим класс, что отгадали
						$el.addClass('desk-cell-guess');
					}

					// так же нужно автоматически деактивировать буквы на Алфавите
					window.app.view.alphabit.deactivateLetter(char);
				}

				pos++;
			}

			pos += (total_cells - offset_cel - currentOpenedChars[iSrc].length);
			iSrc++;
		}
	},
	/*
	 * ф-ия устанавливает эффект flip на не пустые ячейки табло
	 */
	drawAvailableCells: function(){
		//console.log("отработал - drawAvailableCells()");
		// выберим только набор реальных ячеек
		var $desk_cells = this.$('.desk-cell:not(.desc-cell-empty)');
		var letter = "";
		var availableCells = this.model.get('availableCells');
		var pos = 0;
		
		// закрасим ячейки где скрыты буквы
		if (availableCells.length) {
			var offset_row = (availableCells.length === 1 || availableCells.length === 2)? 1: 0;
			
			for (i=0, iSrc=0; i<4; i++) {
				total_cells = (i === 0 || i === 3)? 12: 14;
				
				if (offset_row && !i) {
					pos += total_cells;
					continue;
				}
				if (availableCells[iSrc] === undefined) {
					continue;
				}
				
				var offset_cel = Math.floor((total_cells - availableCells[iSrc].length)/2);
				pos += offset_cel;
				for (j=0; j<availableCells[iSrc].length; j++) {
					letter = availableCells[iSrc][j];
					$obj = $desk_cells.eq(pos);

					if(letter !== false){
						$obj.addClass('desk-cell-colored');

					} else {
						$obj.addClass('desk-cell-colored-space');
					}

					pos++;
				}
				
				pos += (total_cells - offset_cel - availableCells[iSrc].length);
				iSrc++;
			}
		}
		
		// установим эффект flip
		$desk_cells.flip({
			trigger: 'manual'	 
		});
	},
	openDeskCellNotGuess: function()
	{
		var $nabor = this.$('.desk-cell-colored:not(.desk-cell-guess)');
		$nabor.find('.back').html('<input class="input-text-for-desk-cell" type="text" value="" maxlength=1 />');
		$nabor.flip('toggle');
		$nabor.eq(0).find('input').focus();
		this.model.set('isOpenedAllChars', true);
	},
	closeDeskCellNotGuess: function()
	{
		var $nabor = this.$('.desk-cell-colored:not(.desk-cell-guess)');
		$nabor.find('.back').empty();
		$nabor.flip('toggle');
		this.model.set('isOpenedAllChars', false);
	},
	focusInputText: function(event)
	{
		$cur_input = $(event.target);
		var letter = $cur_input.val();
		
		if(letter !== ""){
			$cur_input.select();
		}
	},
	blurInputText: function(event)
	{
		// определим куда поставить фокус. Фокус ставится на следующий пустой input
		var $inputs = this.$('.input-text-for-desk-cell');
		var $cur_input = $(event.target);
		var key = -1;
		
		// подстрахуемся от пробела
		$cur_input.val($.trim($cur_input.val()));
		
		// уберем все выделение с документа из-за предворительного выделения
		document.selection? document.selection.empty(): window.getSelection().removeAllRanges();
		
		// если происходит редактирование ранее введенного символа, 
		for(var i = 0, l = $inputs.length; i < l; i++){
			var letter = $.trim($inputs.eq(i).val());
			
			if(letter === ""){
				$inputs.eq(i).focus();
				key = i;
				break;	
			}
		}
		
		// если все буквы заполнены, то включим кнопку ОТПРАВИТЬ ФРАЗУ
		if(key === -1){
			window.app.view.game.$('#btn-send-phrase').prop('disabled', false);
		}
	}
});