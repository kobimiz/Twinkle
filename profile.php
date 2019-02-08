<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");

    if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
        $username = htmlspecialchars($_SESSION['username']);
        $password = htmlspecialchars($_SESSION['password']);
        if(!login($username, $password))
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

    <link rel="stylesheet" href="styles/general.css" type="text/css">
    <link rel="stylesheet" href="styles/header.css" type="text/css">
    <link rel="stylesheet" href="styles/profile.css" type="text/css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <?php echo "<title> $username's Profile</title>"; ?>
</head>

<body>
    <?php
        include_once("templates/header.php");
    ?>
<div id="sidenavcover">
        <div id="mySidenav" class="sidenavcont">
                <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&#10095;</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Clients</a>
                <a href="#"><img src="/iconList/cog-solid.svg"></a>
                <a href="#" id="logout"><img src="/iconList/sign-out-alt-solid.svg"></a>

        </div>
</div>

<script>
var sidenavcover = document.getElementById("sidenavcover");
 window.onclick = function(event) {
  if (event.target == sidenavcover) {
        sidenavcover.style.display = "none";
  }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "100px";
  document.getElementById("sidenavcover").style.display = "block";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("sidenavcover").style.display = "none";
}
</script>
</body>

</html>