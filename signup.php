<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	
	<link rel="stylesheet" href="styles/Signup.css" type="text/css" >
	
    <title>Sign Up - Twinkle Social Network</title>
</head>
<body onload="document.register.email.focus()";>
<div class="topnav">
  <div id="logo">Twinkle</div>
</div>

    <div class="contain">
            <h1 id="signintro" >Sign up</h1>
              <form method="POST" name="register">
    
                   <label for="email">Email</label><br>
                <input name="email" type="email" id="email" placeholder="Email.." autocomplete="off"  required><br>
                  <label for="choosename">Username</label><br>
                <input name="choosename" id="choosename" type="text" placeholder="Choose username" required autocomplete="off"><br>
                  <label for="choosepass">Password</label><br>
                <input name="choosepass" id="choosepass" type="password" placeholder="Password" required onkeyup="WshowPass()" ><br>
                <img src="/eye-solid.svg" id="Wshowpass"  onclick="Wchangepass()" >
                <input type="submit" name="register" value="Sign up" id="register" >
              </form>
        </div>

        <script src="scripts/signup.js"></script>
</body>
</html>