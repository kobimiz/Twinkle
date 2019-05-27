<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
session_start(); // important to start session after class is loaded, since loading data in session parses them to string and retriving it reparses them to the objects they were
DB::connect();

if(isset($_POST["content"])) {
    $username = DB::getLoggedUserInfo("username")["username"];
    DB::query("insert into replies (`userid`, `commentId`, `content`, `date`) values (".
        DB::query("SELECT * FROM `users` WHERE `username`='".$username."'")->fetch_assoc()["id"].", ".
        $_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->id.", '".
        $_POST['content']."', '".
        date("Y-m-d H:i:s").
    "')");

    array_splice($_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds, 0, 0, array(DB::insertId())); // insert a new post in the beggining


    // consider importing the profilePic function. 
    $picName = DB::query("select profilePic from users where username='".$username."'")->fetch_assoc()['profilePic'];
    echo $username.','.(($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName);
}
?>