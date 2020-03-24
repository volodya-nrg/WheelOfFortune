<? include(__DIR__.'/core.php'); ?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	
    <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/vendor/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="/vendor/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css" />
    <link rel="stylesheet" href="/vendor/animate/animate.css" />
    <link rel="stylesheet" href="/vendor/slick-1.6.0/slick/slick.css" />
    <link rel="stylesheet" href="/css/all.min.css">

    <title>Wheel of resource</title>
</head>

<body id="body-public">
    <div id="error-msg"></div>
    <div id="app"></div>
	<canvas id="confetti" width="1" height="1"></canvas>
	
    <?
        include(__DIR__."/templates/popup-settings.php");

        //"get-friends", 
        $aTpls = ["index", "main-menu", "game", "score", "prizes", "prize-item", 
                          "top-panel", "desk", "alphabit", "wheel", "help"];
    ?>
    <? foreach($aTpls as $val): ?>
            <script id="<?= $val ?>-tpl" type="text/template" >
                    <? include(__DIR__."/templates/".$val.".php"); ?>
            </script>
    <? endforeach; ?>

    <script type="text/javascript" src="/vendor/jquery/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="/vendor/underscore/underscore-min.js"></script>
    <script type="text/javascript" src="/vendor/backbone/backbone-min.js"></script>

    <script type="text/javascript" src="/vendor/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/vendor/jquery/jquery.cookie.js"></script>
    <script type="text/javascript" src="/vendor/jquery/jquery.binarytransport.js"></script>
    <script type="text/javascript" src="/vendor/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="/vendor/jquery/jquery.flip.min.js"></script>
    <script type="text/javascript" src="/vendor/slick-1.6.0/slick/slick.min.js"></script>
	<script type="text/javascript" src="/vendor/anime/anime.min.js"></script>

    <!-- protobuf -->
    <script type="text/javascript" src="/vendor/protobuf/long.min.js"></script>
    <script type="text/javascript" src="/vendor/protobuf/bytebuffer.min.js"></script>
    <script type="text/javascript" src="/vendor/protobuf/protobuf.min.js"></script>

    <!-- model -->
    <script type="text/javascript" src="/js/model/main_menu.js"></script>
    <script type="text/javascript" src="/js/model/prize_list.js"></script>
    <script type="text/javascript" src="/js/model/prize_item.js"></script>
    <script type="text/javascript" src="/js/model/score.js"></script>
    <script type="text/javascript" src="/js/model/score_row.js"></script>
    <script type="text/javascript" src="/js/model/game.js"></script>
    <script type="text/javascript" src="/js/model/top_panel.js"></script>
<!--<script type="text/javascript" src="/js/model/friend.js"></script>-->
    <script type="text/javascript" src="/js/model/wheel.js"></script>
    <script type="text/javascript" src="/js/model/desk.js"></script>

    <!-- view -->
    <script type="text/javascript" src="/js/view/index.js"></script>
    <script type="text/javascript" src="/js/view/main_menu.js"></script>
    <script type="text/javascript" src="/js/view/score.js"></script>
    <script type="text/javascript" src="/js/view/prizes.js"></script>
    <script type="text/javascript" src="/js/view/prize_item.js"></script>
    <!--<script type="text/javascript" src="/js/view/get_friend.js"></script>-->

    <script type="text/javascript" src="/js/view/game.js"></script>
    <script type="text/javascript" src="/js/view/top_panel.js"></script>
    <script type="text/javascript" src="/js/view/desk.js"></script>
    <script type="text/javascript" src="/js/view/alphabit.js"></script>
    <script type="text/javascript" src="/js/view/wheel.js"></script>
    <script type="text/javascript" src="/js/view/help.js"></script>

    <!-- collection -->
    <script type="text/javascript" src="/js/collection/score.js"></script>
    <script type="text/javascript" src="/js/collection/prizes.js"></script>
<!--<script type="text/javascript" src="/js/collection/friends.js"></script>-->

    <!-- route -->
    <script type="text/javascript" src="/js/router/public.js"></script>

    <!-- app -->
    <script type="text/javascript" src="/js/app.js"></script>
</body>
</html>