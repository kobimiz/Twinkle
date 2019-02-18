<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");

    $details; // consider using a different way rather than redirects
    isLoggedIn(function() {
        global $details;
        if(!isset($_GET['user']))
			header("Location: profile.php?user=".$_SESSION['username']);
        else if(($details = details($_GET['user'])) === NULL) {
            include_once("templates/usernotfound.php"); // consider chaging the way this works
            die();
        }
    });
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
        include_once("templates/functions.php");
    ?>
    <main>
        <!-- consider collecting all styles for php files with main tag and make their own stylesheet -->
        <?php
            $numOfPosts = mysqli_fetch_assoc(mysqli_query($connection, "SELECT COUNT(`id`) FROM `posts` WHERE `userID`='".$details['id']."'"))["COUNT(`id`)"];
            echo "<h2>".$details['username']."</h2>".
                $details['username'].", posted ".$numOfPosts." posts since he joined.";
        ?>
    </main>
    <script src="scripts/sidenav.js"></script>
</body>

</html>