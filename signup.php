<?php session_start();require_once("../templates/connection.php"); ?>
<!DOCTYPE html>
<html lang="en-US">
	<head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link rel="stylesheet" href="styles/login.css" type="text/css">
        <link rel="stylesheet" href="styles/general.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

        <title>Sign up for free</title>
	</head>
	<body>
		<header>
			<h1>Register page</h1>
        </header>
		<?php include_once("../templates/greeting.php");include_once("../templates/navmenu.php"); ?>
		<main>
			<h2>Register</h2>
			<?php
				$username = $password = $email = "";
				$usernameErr = $passwordErr = $emailErr = "";
				function testInput($input) {
					$input = trim($input);
					$input = stripslashes($input);
					$input  = htmlspecialchars($input);
					return $input;
				}
				if($_SERVER["REQUEST_METHOD"] == "POST") {
					if(empty($_POST['username'])) 
						$usernameErr = "Please fill in a username";
					else {
						$username = htmlspecialchars($_POST['username']);
						if(!preg_match("/^[a-zA-Z0-9]*$/",$username))
							$usernameErr = "Only letters and numbers allowed";
						elseif(strlen($username) < 4 || strlen($username) >= 15)
							$usernameErr = "Username must be between 4-15 characters";
						else {
							$usernameTaken = "SELECT * FROM `players` WHERE `username` = '$username'";
							$usernameTaken2 = mysqli_query($connection, $usernameTaken);
							if(mysqli_num_rows($usernameTaken2) == 1)
								$usernameErr = "Username already taken";
						}
					}
					if(empty($_POST['password']))
						$passwordErr = "Please fill in a password";
					else {
						$password = htmlspecialchars($_POST['password']);
						if(!preg_match("/^[a-zA-Z0-9]*$/",$password))
							$passwordErr = "Only letters and numbers allowed";
						elseif(strlen($password) < 4 || strlen($password) >= 15)
							$passwordErr = "Password must be between 4-15 characters";
					}
					if(empty($_POST['email']))
						$emailErr = "Please fill in an email adress";
					else {
						$email = testInput($_POST['email']);
						if(!filter_var($email, FILTER_VALIDATE_EMAIL))
							$emailErr = "Please enter a valid email adress";
						elseif(strlen($email) >= 30)
							$passwordErr = "Email mustn't be over 30 characters";
						else {
							$emailTaken = "SELECT * FROM `players` WHERE `email` = '$email'";
							$emailTaken2 = mysqli_query($connection, $emailTaken);
							if(mysqli_num_rows($emailTaken2) == 1)
								$emailErr = "Email is already in use";
						}
					}
				}
				if($usernameErr == "" && $passwordErr == "" && $emailErr == "" && $_SERVER["REQUEST_METHOD"] == "POST") {
					$query = "INSERT INTO `players`(`username`, `password`, `email`, `nickname`) VALUES ('$username', '".password_hash($password, PASSWORD_DEFAULT)."', '$email', 'GoodGuy".rand(1, 1000)."')";
					$sql = mysqli_query($connection, $query);
					echo "<div id='messege'>
							<b>Registered successfully!</b><br/>
							<span class='details'>Username: $username</span><br/>
							<span class='details'>Password: $password</span><br/>
							<span class='details'>Email: $email</span><br/>
						 </div>";
				} else {
					echo "<form action='".htmlspecialchars($_SERVER['PHP_SELF'])."' method='post'>
							 <label for='username'>Username:</label> <input type='text' name='username' id='username' value='$username' />
							 <span class='error'>$usernameErr</span><br/>
							 <label for='password'>Password:</label> <input type='password' name='password' id='password' value='$password' />
							 <span class='error'>$passwordErr</span><br/>
							 <label for='email'>Email:</label> <input type='text' name='email' id='email' value='$email' />
							 <span class='error'>$emailErr</span><br/><br/>
							 <input type='submit' value='Register!' />
						 </form>";
				}
			?>			
		</main>
		<div style="clear: both;"></div>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script src="scripts/events.js"></script>
		<script>
			"use strict";
			$(document).ready(function() {
				
			});
		</script>
	</body>
</html>