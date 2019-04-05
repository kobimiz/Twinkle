<?php
    require_once(__DIR__."/../classes/queries.php");
    require_once(__DIR__."/../classes/posts.php");
    session_start(); // important to start session after class is loaded, since loading data in session parses them to string and retriving it reparses them to the objects they were
    DB::connect();

    if(isset($_POST["content"])) {
        DB::query("insert into comments (`postId`, `userid`, `content`, `date`) values (".
            $_SESSION['posts'][$_POST['postIndex']]->id.", ".
            DB::query("SELECT * FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()["id"].", '".
            $_POST['content']."', '".
            date("Y-m-d H:i:s").
        "')");
    }
?>