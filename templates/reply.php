<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
require_once(__DIR__."/../classes/comment.php");
require_once(__DIR__."/../classes/reply.php");
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

    array_unshift($_SESSION['posts'][$_POST['postIndex']]->comments[$_POST['commentIndex']]->repliesIds, DB::insertId()); // insert a new post in the beggining
    echo json_encode(Reply::getReply(DB::query("select * from replies where id = ".DB::insertId())->fetch_assoc(), DB::getLoggedUserInfo("id")['id']));
}
?>