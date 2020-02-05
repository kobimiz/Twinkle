<?php
    require_once(__DIR__."/../classes/queries.php");
    require_once(__DIR__."/../classes/user.php");
    require_once(__DIR__."/../classes/posts.php");
    require_once(__DIR__."/../classes/comment.php");
    require_once(__DIR__."/../classes/reply.php");
    session_start();
    DB::connect();

    if(isset($_POST['numOfPosts'])) {
        $user = new User(DB::getLoggedUserInfo("id")["id"]);
        $user->loadNextPosts($_POST['numOfPosts']);
    }
?>