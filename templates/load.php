<?php
    require_once(__DIR__."/../classes/queries.php");
    require_once(__DIR__."/../classes/user.php");
    require_once(__DIR__."/../classes/posts.php");
    require_once(__DIR__."/../classes/comment.php");
    require_once(__DIR__."/../classes/reply.php");
    session_start();
    DB::connect();

    function profilePic($picName) {
        return ($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName;
    }

    $user = new User(DB::getLoggedUserInfo("id")["id"]);
    $user->loadNextPosts(1);
?>