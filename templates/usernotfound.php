<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/general.css" type="text/css">
    <link rel="stylesheet" href="styles/header.css" type="text/css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">


    <title>User not found!</title>
</head>

<body>
    <main>
        <br>
        <br>
        <br>
        <br>
        <br>
        <?php
            include_once("templates/header.php");
            include_once("templates/sidenav.php");
            echo "<h2>Oops, something went wrong!</h2>
                <p>The user ".htmlspecialchars($_GET['user'], ENT_QUOTES)."was not found, or has deleted his account.</p>";
        ?>
    </main>
</body>
</html>