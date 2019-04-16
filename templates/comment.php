<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
session_start();
DB::connect();
if(isset($_POST["content"])) {
    DB::query("insert into comments (`postId`, `userid`, `content`, `date`) values (".
        $_SESSION['posts'][$_POST['postIndex']]->id.", ".
        DB::query("SELECT * FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()["id"].", '".
        $_POST['content']."', '".
        date("Y-m-d H:i:s").
    "')");
    //consider importing the profilePic function.
    // todo: update indecies also when uploading posts
    // add comment to the beginning of the array. todo: think of another way because comments are going to be sorted in different way
    array_splice($_SESSION['posts'][$_POST['postIndex']]->commentsIds, 0, 0, DB::insertId());
    $picName = DB::query("select profilePic from users where username='".$_SESSION['username']."'")->fetch_assoc()['profilePic'];
    echo $_SESSION["username"].','.(($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName);
}
?>