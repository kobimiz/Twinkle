<?php
    session_start();
    require_once(__DIR__."/../classes/queries.php");
    DB::connect();
    // consider not deleting rows.... TODO: benchmark
    if(isset($_POST['starRating']) && isset($_SESSION['username'])) {
        $userId = DB::query("SELECT `id` FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id'];
        if($_POST['starRating'] == 0) { // (sakoju)
            $starDiff = -1 * (int)DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['postIds'][$_POST['postIndex']]."'")->fetch_assoc()['stars'];
            DB::query("DELETE FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['postIds'][$_POST['postIndex']]."'");
        }
        elseif(DB::query("SELECT * FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['postIds'][$_POST['postIndex']]."'")->fetch_assoc() !== NULL) { // alter value
            $starDiff = $_POST['starRating'] - DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['postIds'][$_POST['postIndex']]."'")->fetch_assoc()['stars'];
            DB::query("UPDATE `postsstars` SET `stars`=".$_POST['starRating']." WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['postIds'][$_POST['postIndex']]."'");
        }
        else {// insert completly new value
            DB::query("INSERT INTO `postsstars` VALUES ('".
                DB::query("SELECT * FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id']."','".
                $_SESSION['postIds'][$_POST['postIndex']]."','".
                $_POST['starRating']."')");
                $starDiff = $_POST['starRating'];
            }
            DB::query("UPDATE `posts` SET `totalStars`=totalStars + ".$starDiff." WHERE `id`='".$_SESSION['postIds'][$_POST['postIndex']]."'");
            echo $starDiff;
    }
?>