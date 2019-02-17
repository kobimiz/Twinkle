<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");

    if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
        $username = htmlspecialchars($_SESSION['username']);
        $password = htmlspecialchars($_SESSION['password']);
        if(!login($username, $password))
            header("Location: signin.php");
        if(!isset($_GET["user"]))
            header("Location: profile.php?user=".$username);
    }
    else
        header("Location: signin.php");

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

    <?php echo "<title>".$_GET["user"]."'s Profile</title>"; ?>
</head>

<body>
    <?php
        include_once("templates/header.php");
        include_once("templates/sidenav.php");
        include_once("templates/functions.php");
    ?>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <?php
        $sql = "SELECT * FROM `users` WHERE `username` = '$username'";
        $res = mysqli_query($connection, $sql);
        $players  = mysqli_fetch_assoc($res);
        var_dump($players);
    ?>
    <script src="scripts/sidenav.js"></script>
</body>

</html>