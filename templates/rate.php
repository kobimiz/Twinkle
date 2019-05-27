<?php
require_once(__DIR__."/../classes/queries.php");
require_once(__DIR__."/../classes/posts.php");
session_start();
DB::connect();

$username = DB::getLoggedUserInfo("username")["username"];
$userId = DB::query("SELECT `id` FROM `users` WHERE `username`='".$username."'")->fetch_assoc()['id'];
// consider not deleting rows.... TODO: benchmark
if(isset($_POST['starRating'])) {
    $rating = (int)$_POST['starRating'];
    if($rating <= 5 && $rating >= 0) {
        $userId = DB::query("SELECT `id` FROM `users` WHERE `username`='".$username."'")->fetch_assoc()['id'];
        if($rating == 0) { // (sakoju UwU)
            $starDiff = -1 * (int)DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'")->fetch_assoc()['stars'];
            DB::query("DELETE FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'");
        }
        elseif(DB::query("SELECT * FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'")->fetch_assoc() !== NULL) { // alter value
            $starDiff = $rating - DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'")->fetch_assoc()['stars'];
            DB::query("UPDATE `postsstars` SET `stars`=".$rating." WHERE `userID`='".$userId."' AND `postID`='".$_SESSION['posts'][$_POST['postIndex']]->id."'");
        }
        else {// insert completly new value
            DB::query("INSERT INTO `postsstars` VALUES ('".
                DB::query("SELECT * FROM `users` WHERE `username`='".$username."'")->fetch_assoc()['id']."','".
                $_SESSION['posts'][$_POST['postIndex']]->id."','".
                $rating."')");
                $starDiff = $rating;
            }
            DB::query("UPDATE `posts` SET `totalStars`=totalStars + ".$starDiff." WHERE `id`='".$_SESSION['posts'][$_POST['postIndex']]->id."'");
            $stats = DB::query("select avg(stars) as average, sum(stars) as sum from postsstars where postID = ".$_SESSION['posts'][$_POST['postIndex']]->id)->fetch_assoc();
            echo round($stats['average'], 2)."\n".
                ($stats['sum'] | 0); // in case sum=0, than sql returns empty string
    }
}
?>