<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
session_start();

if(isset($_POST['replyIndex'])) {
    DB::query("delete from replies where id=".$_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds[$_POST['replyIndex']]);
    array_splice($_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds, $_POST['replyIndex'], 1);
    var_dump($_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds[$_POST['replyIndex']]);
} elseif(isset($_POST['commentIndex'])) {
    DB::query("delete from comments where id=".$_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->id);
    array_splice($_SESSION['posts'][$_POST['postIndex']]->comments, $_POST['commentIndex'], 1);
} else {

}
?>