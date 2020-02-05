<?php
	require_once("classes/queries.php");
	DB::connect();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="theme-color" content="#001942" >
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">
    <link rel="stylesheet" href="styles/signup.css" type="text/css">

    <title>Sign Up - Twinkle Social Network</title>
</head>

<body>
    <div class="topnav">
        <div id="logo"><img src="/iconList/TwinkleR.png" style="width:65px; height:65px;" alt="Twinkle logo" > winkle</div>
    </div>

    <div class="contain">
		<div class="topcolor">
			<h1 id="signintro">Sign up</h1>
			<img src="/iconList/TwinkleR.png" style="width: 65px; height: 65px;" alt="Twinkle logo" class="TwinkleL">
		</div>
		<?php
			$username = $password = $email = $firstname = $lastname = "";
			$usernameErr = $passwordErr = $emailErr = $firstnameErr = $lastnameErr = $flnameErr = "";
			function testInput($input) {
				$input = trim($input);
				$input = stripslashes($input);
				$input  = htmlspecialchars($input, ENT_QUOTES);
				return $input;
			}
			if($_SERVER["REQUEST_METHOD"] == "POST") {
				if(empty($_POST['username']))
					$usernameErr = "<span class='error'>Please fill in a username</span>";
				else {
					$username = htmlspecialchars($_POST['username'], ENT_QUOTES);
					if(!preg_match("/^[a-zA-Z0-9]*$/",$username))
						$usernameErr = "<span class='error'>Only letters and numbers allowed</span>";
					elseif(strlen($username) < 4 || strlen($username) >= 25)
						$usernameErr = "<span class='error'>Username must be between 4-25 characters</span>";
					elseif(DB::query("SELECT * FROM `users` WHERE `username` = '$username'")->num_rows == 1)
							$usernameErr = "<span class='error'>Username already taken</span>";
				}
				if(empty($_POST['password']))
					$passwordErr = "<span class='error'>Please fill in a password</span>";
				else {
					$password = htmlspecialchars($_POST['password'], ENT_QUOTES);
					if(!preg_match("/^[a-zA-Z0-9]*$/",$password))
						$passwordErr = "<span class='error'>Only letters and numbers allowed</span>";
					elseif(strlen($password) < 6 || strlen($password) >= 25)
						$passwordErr = "<span class='error'>Password must be between 6-25 characters</span>";
				}
				if(empty($_POST['email']))
					$emailErr = "<span class='error'>Please fill in an email address</span>";
				else {
					$email = testInput($_POST['email']);
					if(!filter_var($email, FILTER_VALIDATE_EMAIL))
						$emailErr = "<span class='error'>Please enter a valid email address</span>";
					elseif(strlen($email) >= 40)
						$passwordErr = "<span class='error'>Email mustn't be over 40 characters</span>";
					elseif(DB::query("SELECT * FROM `users` WHERE `email` = '$email'")->num_rows == 1)
							$emailErr = "<span class='error'>Email is already in use</span>";
				}
				if(empty($_POST['fname']))
					$flnameErr = "<span class='error'>Please fill in your full name</span>";
				else{
					$firstname = htmlspecialchars($_POST['fname'], ENT_QUOTES);
					if(!preg_match("/(^[a-zA-Z]+$|^[א-ת]+$)/",$firstname))
						$flnameErr = "<span class='error'>First or last name must contain only letters</span>";
					elseif(strlen($firstname) >= 25)
						$flnameErr = "<span class='error'>First or last name cannot contain more than 25 characters</span>";
				}
				if(empty($_POST['lname']))
					$flnameErr = "<span class='error'>Please fill in your full name</span>";
				else{
					$lastname = htmlspecialchars($_POST['lname'], ENT_QUOTES);
					if(!preg_match("/(^[a-zA-Z]+$|^[א-ת]+$)/",$lastname))
					$flnameErr = "<span class='error'>First or last name must contain only letters</span>";
				elseif(strlen($lastname) >= 25)
					$flnameErr = "<span class='error'>First or last name cannot contain more than 25 characters</span>";
				}
			}
			if($usernameErr == "" && $passwordErr == "" && $emailErr == "" && $firstnameErr == "" && $lastnameErr == "" && $_SERVER["REQUEST_METHOD"] == "POST") {
				DB::query("INSERT INTO `users`(`username`, `password`, `firstname`, `lastname`, `email`, `creationDate`, profilePic) VALUES
				('$username', '".password_hash($password, PASSWORD_DEFAULT)."', '$firstname', '$lastname', '$email', '".date("Y-m-d")."', '')");
				echo "<div id='message'>
						<ul>
						<li>
							<span>Registered successfully! &#10003;</span>
						</li>
						<li>
							<a href='signin.php'>Login</a>
						</li>
						</ul>
					</div>";
			} else {
				echo "<form method='POST' name='register' action='signup.php'>
					<label for='email'>Email</label><br/>
					$emailErr
					<input name='email' type='email' id='email' placeholder='Email..' autocomplete='off' required maxlength='60' value='$email'><br />
					<label for='choosename'>Username</label><br/>
					$usernameErr
					<div class='inputContainer'>
					<input name='username' id='choosename' type='text' placeholder='Username...' required autocomplete='off' maxlength='45' onkeyup='change()' value='$username'><br>
					<div id='count'> <span id='letternum'></span><span>/25</span></div></div><br />
					<div class='labelcon'>
						<div class='firstncon'>
						<label for='fname'>First name</label><br/>
						<input name='fname' id='fname' type='text' placeholder='First name...' required autocomplete='off' maxlength='45' value='$firstname'>
						</div>
						<div>
						<label for='lname'>Last name</label><br/>
						<input name='lname' id='lname' type='text' placeholder='Last name...' required autocomplete='off' maxlength='45' value='$lastname'>
						</div>	
					</div>
					$flnameErr
					<label for='choosepass'>Password</label><br/>
					$passwordErr
					<div class='inputContainer'>
					<input name='password' id='choosepass' type='password' placeholder='Password' required onkeyup='WshowPass()' maxlength='25' value='$password'>
					<img src='iconList/eye-solid.svg' id='Wshowpass' onclick='Wchangepass()'></div>
					<input type='submit' name='register' value='Sign up' id='register'>
					<a href='/signin.php' class='login'>Login</a>
					<br/>
					</form>";
			}
		?>
    </div>
    <script src="scripts/signup.js"></script>
</body>

</html>