<?php session_start();require_once("templates/connection.php"); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/signup.css" type="text/css">

    <title>Sign Up - Twinkle Social Network</title>
</head>

<body>
    <div class="topnav">
        <div id="logo">Twinkle</div>
    </div>

    <div class="contain">
		<h1 id="signintro">Sign up</h1>
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
						$usernameTaken = "SELECT * FROM `users` WHERE `username` = '$username'";
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
						$emailTaken = "SELECT * FROM `users` WHERE `email` = '$email'";
						$emailTaken2 = mysqli_query($connection, $emailTaken);
						if(mysqli_num_rows($emailTaken2) == 1)
							$emailErr = "Email is already in use";
					}
				}
			}
			if($usernameErr == "" && $passwordErr == "" && $emailErr == "" && $_SERVER["REQUEST_METHOD"] == "POST") {
				$query = "INSERT INTO `users`(`username`, `password`, `email`) VALUES ('$username', '".password_hash($password, PASSWORD_DEFAULT)."', '$email')";
				//$sql = mysqli_query($connection, $query);
				echo "<div id='messege'>
						<b>Registered successfully!</b><br/>
						<span class='details'>Email: $email</span><br/>
						<span class='details'>Username: $username</span><br/>
						<span class='details'>Password: $password</span><br/>
						</div>";
			} else {
				echo '<form method="POST" name="register" action="signup.php">
						<label for="email">Email</label><br>
						<input name="email" type="email" id="email" placeholder="Email.." autocomplete="off" required maxlength="40"><br>
						<label for="choosename">Username</label><br>
						<input name="username" id="choosename" type="text" placeholder="Choose username" required autocomplete="off"
							maxlength="25"><br>
						<label for="choosepass">Password</label><br>
						<input name="password" id="choosepass" type="password" placeholder="Password" required onkeyup="WshowPass()"
							maxlength="30"><br>
						<img src="iconList/eye-solid.svg" id="Wshowpass" onclick="Wchangepass()">
						<input type="submit" name="register" value="Sign up" id="register">
						</form>';
			}
		?>
    </div>

    <script src="scripts/signup.js"></script>
</body>

</html>