<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");

    $username = $password = $loginErr = "";
	if($_SERVER["REQUEST_METHOD"] == "POST") {
		if(isset($_POST['username'])) { // Checking the request, this might need to be removed....
			$username = htmlspecialchars($_POST['username']);
			$password = htmlspecialchars($_POST['password']);
			if(login($username, $password)) {
				$_SESSION['username'] = $username;
                $_SESSION['password'] = $password;
                header("Location: profile.php");
			} else
				$loginErr = "Invalid username and password combination";
			
			$data = array("username"=>$username, "password"=>$password, "status"=>$loginErr);
			exit(json_encode($data));
		}
	}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/signin.css" type="text/css">
    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <title>Twinkle sign in or sign up!</title>
</head>

<body onload="document.login.username.focus()">
    <div class="contain">
        <div id="logo">Twinkle</div>
        <h1 id="signintro">Sign up</h1>
        <form method="POST" name="register">
            <label for="email">Email</label><br>
            <input name="email" type="email" id="email" placeholder="Email.." autocomplete="off" required maxlength="40"><br>
            <label for="choosename">Username</label><br>
            <input name="username" id="choosename" type="text" placeholder="Choose username" required autocomplete="off" maxlength="25"><br>
            <label for="choosepass">Password</label><br>
            <input name="password" id="choosepass" type="password" placeholder="Password" required onkeyup="WshowPass()" maxlength="30"><br>
            <img src="iconList/eye-solid.svg" id="Wshowpass" onclick="Wchangepass()">
            <input type="submit" name="register" value="Sign up" id="register">
        </form>
    </div>

    <span id="midLine"></span>

    <section id="loginsec">
        <h1 id="intro"><em>Login</em></h1>
        <form method="post" name="login">
            <label for="username">Username or Email</label><br>
            <input name="username" id="username" type="text" placeholder="Username" required autocomplete="off" maxlength="30"><br>
            <label for="password">Password</label><br>
            <input name="password" id="password" type="password" placeholder="Password" required onkeyup="showPass()"><br>
            <img src="iconList/eye-solid.svg" id="showpass" onclick="changepass()">
            <input name="login" type="submit" value="Login" id="login"><br>
        </form>
        <a href="#">Forgot password?</a>
    </section>
    <script src="scripts/signin.js"></script>
</body>

</html>