<?php
	session_start();
	require_once("classes/queries.php");
	DB::connect();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">
    <link rel="stylesheet" href="styles/signup.css" type="text/css">

    <title>Sign Up - Twinkle Social Network</title>
</head>

<body>
    <div class="topnav">
        <div id="logo"><img src="/iconList/TwinkleR.png" style="width:65px; height:65px;" alt="Twinkle logo" > winkle</div>
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
					elseif(strlen($username) < 4 || strlen($username) >= 25)
						$usernameErr = "Username must be between 4-25 characters";
					elseif(DB::query("SELECT * FROM `users` WHERE `username` = '$username'")->num_rows == 1)
							$usernameErr = "Username already taken";
				}
				if(empty($_POST['password']))
					$passwordErr = "Please fill in a password";
				else {
					$password = htmlspecialchars($_POST['password']);
					if(!preg_match("/^[a-zA-Z0-9]*$/",$password))
						$passwordErr = "Only letters and numbers allowed";
					elseif(strlen($password) < 6 || strlen($password) >= 25)
						$passwordErr = "Password must be between 6-25 characters";
				}
				if(empty($_POST['email']))
					$emailErr = "Please fill in an email address";
				else {
					$email = testInput($_POST['email']);
					if(!filter_var($email, FILTER_VALIDATE_EMAIL))
						$emailErr = "Please enter a valid email address";
					elseif(strlen($email) >= 40)
						$passwordErr = "Email mustn't be over 40 characters";
					elseif(DB::query("SELECT * FROM `users` WHERE `email` = '$email'")->num_rows == 1)
							$emailErr = "Email is already in use";
				}
			}
			if($usernameErr == "" && $passwordErr == "" && $emailErr == "" && $_SERVER["REQUEST_METHOD"] == "POST") {
				DB::query("INSERT INTO `users`(`username`, `password`, `email`, `creationDate`) VALUES ('$username', '".password_hash($password, PASSWORD_DEFAULT)."', '$email', '".date("Y-m-d")."')");
				echo "<div id='messege'>
						<b>Registered successfully!</b><br/>
						<span class='details'>Email: $email</span><br/>
						<span class='details'>Username: $username</span><br/>
						<span class='details'>Password: $password</span><br/>
						<a href='signin.php'>Sign in</a>
						</div>";
			} else {
				echo "<form method='POST' name='register' action='signup.php'>
					<label for='email'>Email</label><br/>
					<span class='error'>$emailErr</span><br/>
					<input name='email' type='email' id='email' placeholder='Email..' autocomplete='off' required maxlength='60'><br />
					<label for='choosename'>Username</label><br/>
					<span class='error'>$usernameErr</span><br/>
					<div class='inputContainer'>
					<input name='username' id='choosename' type='text' placeholder='Username' required autocomplete='off' maxlength='45' onkeyup='change()'><br>
					<div id='count'> <span id='letternum'></span><span>/25</span></div></div><br />
					<label for='fname'>First name</label> <label for='lname'>Last name</label> <br />
					<input name='fname' id='fname' type='text' placeholder='First name...' required autocomplete='off' maxlength='45'>
					<input name='lname' id='lname' type='text' placeholder='Last name...' required autocomplete='off' maxlength='45'>
					<label for='choosepass'>Password</label><br/>
					<span class='error'>$passwordErr</span><br/>
					<div class='inputContainer'>
					<input name='password' id='choosepass' type='password' placeholder='Password' required onkeyup='WshowPass()' maxlength='25'>
					<img src='iconList/eye-solid.svg' id='Wshowpass' onclick='Wchangepass()'></div>
					<input type='submit' name='register' value='Sign up' id='register'>
					<a href='/signin.php' class='login'>Log in</a>
					</form>";
			}
		?>
    </div>
    <script src="scripts/signup.js"></script>
</body>

</html>