<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");

    if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
        $username = htmlspecialchars($_SESSION['username']);
        $password = htmlspecialchars($_SESSION['password']);
        if(login($username, $password)) {
            echo "Welcome $username";
        } else
            header("Location: signin.php");
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

    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/profile.css">

    <title>Profile</title>
</head>

<body>
    
</body>

</html>