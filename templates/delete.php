<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
session_start();


if(isset($_POST['replyIndex'])) {
    $replyId = $_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds[$_POST['replyIndex']];
    if(DB::queryScalar("select userid from replies where id=".$replyId) == DB::getLoggedUserInfo("id")["id"]) {
        DB::query("delete from replies where id=".$replyId);
        array_splice($_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds, $_POST['replyIndex'], 1);
    }
} elseif(isset($_POST['commentIndex'])) {
    $commentId = $_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->id;
    if(DB::queryScalar("select userid from comments where id=".$commentId) == DB::getLoggedUserInfo("id")["id"]) {
        DB::query("delete from comments where id=".$commentId);
        array_splice($_SESSION['posts'][$_POST['postIndex']]->comments, new Comment($_POST['commentIndex']), 1);
    }
} else {

}
?>