<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
session_start();

// todo: add error codes and dictionary
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
        array_splice($_SESSION['posts'][$_POST['postIndex']]->comments, $_POST['commentIndex'], 1);
    }
} else {
    $postId = $_SESSION['posts'][$_POST['postIndex']]->id;
    if(DB::queryScalar("select userid from posts where id=".$postId) == DB::getLoggedUserInfo("id")["id"]) {
        if(!unlink(__DIR__."/../uploads/".DB::queryScalar("select fileUploaded from posts where id=".$postId)))
            echo "error deleting file"; // todo: deal with this error if occurs
        DB::query("delete from posts where id=".$postId);
        array_splice($_SESSION['posts'], $_POST['postIndex'], 1);
    }
}
?>