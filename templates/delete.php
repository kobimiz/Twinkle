<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
session_start();

if(isset($_POST['replyIndex'])) {
    var_dump($_POST['postIndex']);
    var_dump($_POST['commentIndex']);
    var_dump($_POST['replyIndex']);
    //DB::query("delete from replies where id=".$_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->id);
} elseif(isset($_POST['commentIndex'])) {
    DB::query("delete from comments where id=".$_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->id);
    splice($_SESSION['posts'][$_POST['postIndex']]->comments, $_POST['commentIndex'], 1);
} else {

}
?>