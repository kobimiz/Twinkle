<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
session_start();

if(isset($_POST['replyIndex'])) {

} elseif(isset($_POST['commentIndex']))
    DB::query("delete from comments where id=".$_SESSION['posts'][$_POST['postIndex']]->commentsIds[$_POST['commentIndex']]);
else {

}
?>