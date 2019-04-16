<?php
require_once('classes/queries.php');
DB::connect();
$userid = DB::isLoggedIn();
if($userid && $_GET['allDevices']) {
	DB::query("delete from loginTokens where userid=".$userid);
	setcookie("SNID", '1', time() - 3600);
	setcookie("SNID_", '1', time() - 3600);
}
elseif($userid) {
	DB::query("delete from loginTokens where token='".sha1($_COOKIE['SNID'])."'");
	setcookie("SNID", '1', time() - 3600);
	setcookie("SNID_", '1', time() - 3600);
}
header('Location: signin.php');
?>