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
    array_splice($_SESSION['posts'][$_POST['postIndex']]->comments, 0, 0, new Comment(DB::insertId())); // insert in the begging of the array
    $picName = DB::query("select profilePic from users where username='".$username."'")->fetch_assoc()['profilePic'];
    echo $username.','.(($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName);
}
?>