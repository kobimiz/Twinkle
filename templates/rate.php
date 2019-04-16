<?php
    require_once(__DIR__."/../classes/queries.php");
    require_once(__DIR__."/../classes/posts.php");
    session_start();
    DB::connect();

    $userId = DB::query("SELECT `id` FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id'];
    // consider not deleting rows.... TODO: benchmark
    if(isset($_POST['starRating']) && isset($_SESSION['username'])) {
        $userId = DB::query("SELECT `id` FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id'];
        if($_POST['starRating'] == 0) { // (sakoju UwU)
            $starDiff = -1 * (int)DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'")->fetch_assoc()['stars'];
            DB::query("DELETE FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'");
        }
        elseif(DB::query("SELECT * FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'")->fetch_assoc() !== NULL) { // alter value
            $starDiff = $_POST['starRating'] - DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'")->fetch_assoc()['stars'];
            DB::query("UPDATE `postsstars` SET `stars`=".$_POST['starRating']." WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'");
        }
        else {// insert completly new value
            DB::query("INSERT INTO `postsstars` VALUES ('".
                DB::query("SELECT * FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id']."','".
                $_SESSION['posts'][$_POST['postIndex']]->id."','".
                $_POST['starRating']."')");
                $starDiff = $_POST['starRating'];
            }
            DB::query("UPDATE `posts` SET `totalStars`=totalStars + ".$starDiff." WHERE `id`='".$_SESSION['posts'][$_POST['postIndex']]->id."'");
            $stats = DB::query("select avg(stars) as average, sum(stars) as sum from postsstars where postID = ".$_SESSION['posts'][$_POST['postIndex']]->id)->fetch_assoc();
            echo round($stats['average'], 2)."\n".
                ($stats['sum'] | 0); // in case sum=0, than sql returns empty string
    }
?>