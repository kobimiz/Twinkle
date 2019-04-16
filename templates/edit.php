<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
session_start();

if(isset($_POST['replyIndex'])) {

} elseif(isset($_POST['commentIndex']))
    DB::query("update comments set content='".$_POST['content']."' where id=".$_SESSION['posts'][$_POST['postIndex']]->commentsIds[$_POST['commentIndex']]);
else {

}
?>