<?php
require_once("classes/queries.php");
DB::connect();

if(!DB::isLoggedIn())
    header("Location: signin.php");

if(!isset($_GET['user']))
    header("Location: profile.php?user=".DB::getLoggedUserInfo("username")["username"]);
else if(($details = DB::query("SELECT * FROM `users` WHERE `username`='".$_GET['user']."'")->fetch_assoc()) === NULL) {
    include_once("templates/usernotfound.php"); // consider chaging the way this works
    die();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/general.css" type="text/css">
    <link rel="stylesheet" href="styles/header.css" type="text/css">
    <link rel="stylesheet" href="styles/profile.css" type="text/css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <?php echo "<title>".htmlspecialchars($_GET["user"])."'s Profile</title>"; ?>
</head>

<body>
    <?php
        include_once("templates/header.php");
        include_once("templates/sidenav.php");
    ?>
    <main>
        <!-- consider collecting all styles for php files with main tag and make their own stylesheet -->
        <?php
            $numOfPosts = DB::query("SELECT COUNT(`id`) FROM `posts` WHERE `userID`='".$details['id']."'")->fetch_assoc()["COUNT(`id`)"];
            $totalStars = DB::query("SELECT SUM(`totalStars`) FROM `posts` WHERE `userID`='".$details['id']."'")->fetch_assoc()["SUM(`totalStars`)"];
            echo "<h2>".$details['username'].
                "<span id='creationDate'> Created his account at ".$details['creationDate']."</span></h2>".
                $details['username'].", posted ".$numOfPosts." posts since he joined.<br/>";
                if($numOfPosts != 0)
                    echo "He got ".$totalStars." stars in total, averaging ".$totalStars/$numOfPosts.".";

        ?>
    </main>
    <script src="scripts/sidenav.js"></script>
</body>

</html>