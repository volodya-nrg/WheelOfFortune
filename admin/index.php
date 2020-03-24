<?
	include(__DIR__.'/../core.php');
	
	$aErrors = [];
	
	if(isset($_POST['login']) || isset($_POST['pass'])){
		$login = !empty($_POST['login'])? $_POST['login']: "";
		$pass = !empty($_POST['pass'])? $_POST['pass']: "";
		
		if($login == ""){
			$aErrors[] = 'set login';
		}
		if($pass == ""){
			$aErrors[] = 'set pass';
		}
		
		if(!sizeof($aErrors)){
			if($login == 'admin' && $pass == 'admin'){
				$_SESSION['admin'] = true;
			
			} else {
				$aErrors[] = 'incorrect login/pass';
			}
		}
	}
?>

<!doctype html>
<html>
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	
	<link type="text/css" rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css">
	<link type="text/css" rel="stylesheet" href="/vendor/font-awesome-4.6.3/css/font-awesome.min.css">
	<link type="text/css" rel="stylesheet" href="/vendor/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css" />
	<link type="text/css" rel="stylesheet" href="/vendor/slick-1.6.0/slick/slick.css" />
    <link type="text/css" rel="stylesheet" href="/css/admin.css">
	
	<title>v 0.0.5</title>
</head>

<body id="admin">
	<? if(!empty($_SESSION['admin'])): ?>
		<div class="container">
			<div class="row">
				<?
					$aLinks = [
						['href'=>'/admin/theme', 		'name'=>'Theme'],
						['href'=>'/admin/phrase', 		'name'=>'Phrases'],
						['href'=>'/admin/rules', 		'name'=>'Rules'],
						['href'=>'/admin/prize', 		'name'=>'Prizes'],
						['href'=>'/admin/statistic',  	'name'=>'Statistics'],
					];
				?>
                <div class="col-xs-12">
                	<table border="0" cellpadding="0" cellspacing="0" width="100%" height="50">
                    	<tr>
							<? foreach($aLinks as $val): ?>
                                <td align="center" valign="middle" width="20%">
                                    <a href="<?= $val['href'] ?>"><?= $val['name'] ?></a>
                                </td>
                            <? endforeach; ?>
                       </tr>
                    </table>
                </div>
			</div>
		</div>
		<div id="app"></div>
		
		<!-- theme-tpl -->
		<script id="theme-tpl" type="text/template">
			<div class="container bg-white">
				<div class="row">
					<div class="col-xs-12">
						<h2>Theme</h2>
						<table border=0 cellspacing=0 cellpadding=0 width="100%">
							<tr>
								<td width=200>
									<input class="form-control" type="text" name="theme" />
								</td>
								<td width=10></td>
								<td width="*">
									<button id="btn-add" class="btn btn-success">Add</button>
									<button id="btn-on-off" class="btn btn-primary">On/Off</button>
								</td>
								<td width="100">
									<button id="btn-delete" class="btn btn-danger pull-right">Delete</button>
								</td>	
							</tr>
						</table>
						<br />
						<table class="table table-bordered">
							<thead>
								<th>id</th>
								<th data-sort="name">name theme</th>
								<th data-sort="total_words">total wors in theme</th>
								<th data-sort="status">status on/off</th>
								<th></th>
							</thead>
							<tbody id="target"></tbody>
						</table>
					</div>
				</div>
			</div>
		</script>
		
		<!-- theme-row-tpl -->
		<script id="theme-row-tpl" type="text/template">
			<td><%- id %></td>
			<td class="edit-name" contenteditable="true"><%- name %></td>
			<td><%- total_words %></td>
			<td><%- status %></td>
			<td><input type="checkbox" <%- checked? 'checked': '' %> /></td>	
		</script>
		
		<!-- phrase-tpl -->
		<script id="phrase-tpl" type="text/template">
			<div class="container bg-white">
				<div class="row">
					<div class="col-xs-12">
						<h2>Redactor phrases</h2>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-2">
						Select theme
						<select class="form-control" name="theme">
							<option value=""></option>
							<% if(data.themes != undefined && data.themes.length){ %>
								<% _.each(data.themes, function(model){ %>
									<option value="<%- model.get('id') %>"><%- model.get('name') %></option>	
								<% }); %>
							<% } %>
						</select>
					</div>
					<div class="col-xs-2">
						complexity phrase
						<select class="form-control inline" name="complexity">
							<option value="easy">easy</option>
							<option value="normal">normal</option>
							<option value="hard">hard</option>
						</select>
					</div>
					<div class="col-xs-3">
						set phrase
						<input class="form-control" type="text" name="phrase" />
						<small class="text-muted">не более 4 слов, если их длины больше 12 символов, не более 44 символов во фразе</small>
					</div>	
					<div class="col-xs-5">
						<br />
						<button id="btn-add" class="btn btn-success">Add</button>
						<button id="btn-on-off" class="btn btn-primary">On/Off</button>
						<button id="btn-delete" class="btn btn-danger">Delete</button>
						<div class="pull-right">
							<input type="checkbox" name="show_not_set" /> show is not attached
							<button id="btn-refresh" class="btn btn-warning"><i class="fa fa-refresh"></i></button>
						</div>
					</div>	
				</div>
				<br />
				<div class="row">
					<div class="col-xs-12">
						<table class="table table-bordered">
							<thead>
								<th data-sort="id">id</th>
								<th data-sort="phrase">phrase</th>
								<th data-sort="theme">theme</th>
								<th data-sort="complexity">complexity</th>
								<th data-sort="status">status</th>
								<th></th>
							</thead>
							<tbody id="target"></tbody>
						</table>
					</div>
				</div>		
			</div>	
		</script>
		
		<!-- phrase-row-tpl -->
		<script id="phrase-row-tpl" type="text/template">
			<td><%- id %></td>
			<td class="edit-name" contenteditable="true"><%- name %></td>
			<td><%- theme %></td>
			<td><%- complexity %></td>
			<td><%- status %></td>
			<td><input type="checkbox" <%- checked? 'checked': '' %> /></td>					
		</script>
		
		<!-- rules-tpl -->
		<script id="rules-tpl" type="text/template">
			<div class="container bg-white">
				<div class="row">
					<div class="col-xs-12">
						<h2>Rules Settings + The length of time per round</h2>
						<table class="table table-bordered">
							<tr>
								<td>The length of time on the course (time guessing the letters)</td>
								<td>
									<input class="form-control" type="text" name="time_on_move" value="<%- data.time_on_move %>" placeholder="range 3-30" />
								</td>
							</tr>
							<tr>
								<td>Maximum number of strokes</td>
								<td>
									<input class="form-control" type="text" name="max_move" value="<%- data.max_move %>" placeholder="range 1-10" />
								</td>
							</tr>
							<tr>
								<td>The value of speed-bonus</td>
								<td>
									<input class="form-control" type="text" name="speed_bonus_value" value="<%- data.speed_bonus_value %>" placeholder="range 1000-10000" />
								</td>
							</tr>
							<tr>
								<td>The speed of download speed-bonus points</td>
								<td>
									<input class="form-control" type="text" name="time_minus_speed_bonus" value="<%- data.time_minus_speed_bonus %>" placeholder="range 1-100" />
								</td>
							</tr>
							<tr>
								<td>Time through which you can play again</td>
								<td>
									<div class="btn-group" data-toggle="buttons">
										<input class="form-control" type="text" name="time_through_which_you_can_play_again" placeholder="range 1-24" value="<%- data.time_through_which_you_can_play_again %>" />
									</div>
								</td>
							</tr>
							<tr>
								<td>reset time of the week s top table</td>
								<td>
									<input class="form-control datepicker" type="text" name="time_reset_date" placeholder="date" style="display:inline; width:100px;" value="<%- data.time_reset_date %>" />
									 <input class="form-control" type="text" name="time_reset_date" placeholder="чч:мм" style="display:inline; width:100px;" value="<%- data.time_reset_date %>" />
								</td>
							</tr>
							<tr>
								<td>Number of top players who will be invited to the game of the week</td>
								<td>
									<input class="form-control" name="total_gamblers_of_week" type="text" value="<%- data.total_gamblers_of_week %>" placeholder="range 1-10" />
								</td>
							</tr>
							<tr>
								<td>Number of top players who will be invited to the game of the month</td>
								<td>
									<input class="form-control" name="total_gamblers_of_mon" type="text" value="<%- data.total_gamblers_of_mon %>" placeholder="range 1-10" />
								</td>
							</tr>
							<tr>
								<td>Number of invitations to friends to the game for one game</td>
								<td>
									<input class="form-control" name="total_invitation_friends_on_one_game" type="text" value="<%- data.total_invitation_friends_on_one_game %>" placeholder="range 1-10" />
								</td>
							</tr>
							<tr>
								<td>Number of awards for invitation 1</td>
								<td>
									<input class="form-control" name="total_awards_on_one_invite" type="text" value="<%- data.total_awards_on_one_invite %>" placeholder="range 1-10" />
								</td>
							</tr>
						</table>
						<div class="text-right">
							<button id="btn-save" class="btn btn-success">Save</button>
						</div>
						<br />
					</div>
				</div>
			</div>
		</script>
		
		<!-- prize-tpl -->
		<script id="prize-tpl" type="text/template">
			<div class="container bg-white">
				<div class="row">
					<div class="col-xs-12">
						<h2>Setting prizes</h2>
						
						<ul class="nav nav-tabs">
							<li class="active"><a href="#tab-reg" data-toggle="tab">regular</a></li>
							<li><a href="#tab-week" data-toggle="tab">of the week</a></li>
							<li><a href="#tab-mon" data-toggle="tab">of the month</a></li>
						</ul>
						
						<div class="tab-content">
							<div id="tab-reg" class="tab-pane active"></div>
							<div id="tab-week" class="tab-pane"></div>
							<div id="tab-mon" class="tab-pane"></div>
						</div>
						<br />
					</div>
				</div>
			</div>
		</script>
		
		<!-- prize-tbl-tpl -->
		<script id="prize-tbl-tpl" type="text/template">
			<div class="row">
				<div class="col-xs-3">
					 <div class="fileOutput" align="center"></div>
				</div>
				<div class="col-xs-9">
					<form role="form" onSubmit="return false;">
						<div class="form-group">
							<label class="btn btn-primary btn-file" title="select image">
								<span>Select a file</span>
								<input type="file" name="image" />
							</label>
						</div>
						<div class="form-group">
							<label>Link</label>
							<input class="form-control" type="text" name="link" placeholder="" />
						</div>
						<div class="form-group">
							<label>Name</label>
							<input class="form-control" type="text" name="name" placeholder="" />
						</div>
						<div class="form-group">
							<label>Prise</label>
							<input class="form-control" type="text" name="price" placeholder="" />
						</div>
						<div class="form-group">
							<button id="btn-add" class="btn btn-success">Add</button>
							<button id="btn-on-off" class="btn btn-primary">On/Off</button>
							<button id="btn-delete" class="btn btn-danger pull-right">Delete</button>
						</div>
						<input class="hide" type="reset" />
					</form>
				</div>
			</div>
			<br />
			<table class="table table-bordered">
				<thead>
					<th data-sort="id">id</th>
					<th>image</th>
					<th data-sort="link">link</th>
					<th data-sort="name">name</th>
					<th data-sort="price">price</th>
					<th data-sort="status">status</th>
					<th></th>
				</thead>
				<tbody id="target"></tbody>
			</table>
		</script>
		
		<!-- prize-row-tpl -->
		<script id="prize-row-tpl" type="text/template">
			<td><%- id %></td>
			<td><%= image %></td>
			<td class="edit-link" contenteditable="true"><%- link %></td>
			<td class="edit-name" contenteditable="true"><%- name %></td>
			<td class="edit-price" contenteditable="true"><%- price %></td>
			<td><%- status %></td>
			<td><input type="checkbox" <%- checked? 'checked': '' %> /></td>
		</script>
		
		<!-- statistic-tpl -->
		<script id="statistic-tpl" type="text/template">
			<div class="container bg-white">
				<div class="row">
					<div class="col-xs-12">
						<h2>Player Stats</h2>
						
						<table class="table table-bordered">
							<thead>
								<th>users</th>
								<th>points</th>
								<th>date</th>
							</thead>
							<tbody>
								<% if(data.rows != undefined && data.rows.length){ %>
									<% _.each(data.rows, function(model, key){ %>
										<tr>
											<td><%- model.get('user') %></td>
											<td><%- model.get('points') %></td>
											<td><%- model.get('date') %></td>
										</tr>
									<% }); %>
								<% } %>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</script>
		
		<script type="text/javascript" src="/vendor/jquery/jquery-3.2.1.min.js"></script>
		<script type="text/javascript" src="/vendor/underscore/underscore-min.js"></script>
		<script type="text/javascript" src="/vendor/backbone/backbone-min.js"></script>
		
		<script type="text/javascript" src="/vendor/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
		<script type="text/javascript" src="/vendor/bootstrap/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="/vendor/jquery/jquery.flip.min.js"></script>
		<script type="text/javascript" src="/vendor/slick-1.6.0/slick/slick.min.js"></script>
		
		<!-- protobuf -->
		<script type="text/javascript" src="/vendor/protobuf/long.min.js"></script>
		<script type="text/javascript" src="/vendor/protobuf/bytebuffer.min.js"></script>
		<script type="text/javascript" src="/vendor/protobuf/protobuf.min.js"></script>
		
		<!-- model -->
		<script type="text/javascript" src="/js/model/admin_theme_row.js"></script>
		<script type="text/javascript" src="/js/model/admin_phrase_row.js"></script>
		<script type="text/javascript" src="/js/model/admin_prize_row.js"></script>
		<script type="text/javascript" src="/js/model/admin_stat_row.js"></script>
		
		<!-- view -->
		<script type="text/javascript" src="/js/view/admin_theme.js"></script>
		<script type="text/javascript" src="/js/view/admin_theme_row.js"></script>
		<script type="text/javascript" src="/js/view/admin_phrase.js"></script>
		<script type="text/javascript" src="/js/view/admin_phrase_row.js"></script>
		<script type="text/javascript" src="/js/view/admin_rules.js"></script>
		<script type="text/javascript" src="/js/view/admin_prize.js"></script>
		<script type="text/javascript" src="/js/view/admin_prize_tbl.js"></script>
		<script type="text/javascript" src="/js/view/admin_prize_row.js"></script>
		<script type="text/javascript" src="/js/view/admin_statistic.js"></script>
		
		<!-- collection -->
		<script type="text/javascript" src="/js/collection/admin_theme.js"></script>
		<script type="text/javascript" src="/js/collection/admin_phrase.js"></script>
		<script type="text/javascript" src="/js/collection/admin_prize.js"></script>
		<script type="text/javascript" src="/js/collection/admin_stat.js"></script>
		
		<!-- route -->
		<script type="text/javascript" src="/js/router/admin.js"></script>
		
		<!-- app -->
		<script type="text/javascript" src="/js/admin.js"></script>
	<? else: ?>
		<br />
		<br />
		<br />
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-sm-6 col-sm-offset-3">
					<? if(sizeof($aErrors)): ?>
						<div class="alert alert-danger">
							Errors:
							<ul>
							<? foreach($aErrors as $key => $val): ?>
								<li><?= $val ?></li>
							<? endforeach; ?>
							</ul>
						</div>
					<? endif; ?>
					
					<form class="form" action="" method="post">
						<div class="form-group">
							<label>Login:</label> 
							<input class="form-control" type="text" name="login" value="<?= !empty($_POST['login'])? $_POST['login']: '' ?>" />
						</div>
						<div class="form-group">
							<label>Pass:</label> 
							<input class="form-control" type="password" name="pass" value="" />
						</div>
						<button type="submit" class="btn btn-default">Send</button>
					</form>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="/vendor/jquery/jquery-3.2.1.min.js"></script>
		<script type="text/javascript" src="/vendor/bootstrap/js/bootstrap.min.js"></script>
	<? endif; ?>
</body>
</html>