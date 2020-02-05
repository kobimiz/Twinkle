<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
session_start();
DB::connect();
if(isset($_POST["content"])) {
    $username = DB::getLoggedUserInfo("username")["username"];
    DB::query("insert into comments (`postId`, `userid`, `content`, `date`) values (".
        $_SESSION['posts'][$_POST['postIndex']]->id.", ".
        DB::query("SELECT * FROM `users` WHERE `username`='".$username."'")->fetch_assoc()["id"].", '".
        $_POST['content']."', '".
        date("Y-m-d H:i:s").
    "')");
    //consider importing the profilePic function.
    // todo: update indecies also when uploading posts
    // add comment to the beginning of the array. todo: think of another way because comments are going to be sorted in different way
    $comment = new Comment(DB::insertId());
    array_unshift($_SESSION['posts'][$_POST['postIndex']]->comments, $comment); // insert in the begging of the array
    echo json_encode($comment->getComment(DB::getLoggedUserInfo("id")["id"]));
}

?>