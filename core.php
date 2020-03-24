<?
// запустим сессию
	session_start();

// проверим версию php
	if (version_compare(PHP_VERSION, '5.3.0', '<') == true) {
		die("Err: change php version (".PHP_VERSION.").");
	}

// объявим константы и создадим установки
	define("DEBUG", 1);
	
	ini_set('error_reporting', 	E_ALL); // вывод всех ошибок, в 5.4 E_NOTICE входит в состав E_ALL
	ini_set("display_errors",	DEBUG? "On": "Off"); 
	ini_set("error_log", 		__DIR__."/_errors_jahsduiqywe.log");
	ini_set("default_charset",	"UTF-8");
	
// установим временную зону
	if (!ini_get('date.timezone')) {
		date_default_timezone_set('UTC');
	}

// обработаем магические кавычки, если включено magic_quotes_gpc
	if (ini_get('magic_quotes_gpc')) {
		function clean($data) {
			if (is_array($data)) {
				foreach ($data as $key => $value) {
					$data[clean($key)] = clean($value);
				}
			
			} else {
				$data = stripslashes($data);
			}
	
			return $data;
		}
	
		$_GET = clean($_GET);
		$_POST = clean($_POST);
		$_COOKIE = clean($_COOKIE);
	}

// Windows IIS Compatibility
	if (!isset($_SERVER['DOCUMENT_ROOT']) && isset($_SERVER['SCRIPT_FILENAME'])) {
		$_SERVER['DOCUMENT_ROOT'] = str_replace('\\', '/', substr($_SERVER['SCRIPT_FILENAME'], 0, 0 - strlen($_SERVER['PHP_SELF'])));
	}
	if (!isset($_SERVER['DOCUMENT_ROOT']) && isset($_SERVER['PATH_TRANSLATED'])) {
		$_SERVER['DOCUMENT_ROOT'] = str_replace('\\', '/', substr(str_replace('\\\\', '\\', $_SERVER['PATH_TRANSLATED']), 0, 0 - strlen($_SERVER['PHP_SELF'])));
	}
	if (!isset($_SERVER['REQUEST_URI'])) {
		$_SERVER['REQUEST_URI'] = substr($_SERVER['PHP_SELF'], 1);
	
		if (isset($_SERVER['QUERY_STRING'])) {
			$_SERVER['REQUEST_URI'] .= '?'.$_SERVER['QUERY_STRING'];
		}
	}
	if (!isset($_SERVER['HTTP_HOST'])) {
		$_SERVER['HTTP_HOST'] = getenv('HTTP_HOST');
	}
	
// проверим на SSL
	if ( ( isset($_SERVER['HTTPS']) && 
		   ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == '1') ) 
		 || $_SERVER['SERVER_PORT'] == 443 ) {
		$_SERVER['HTTPS'] = true;
	
	} elseif(!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' || !empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on') {
		$_SERVER['HTTPS'] = true;
	
	} else {
		$_SERVER['HTTPS'] = false;
	}