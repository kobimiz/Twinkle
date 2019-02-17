<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/signin.css" type="text/css">
    <link rel="stylesheet" href="styles/general.css" type="text/css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <title>Sign in to Twinkle</title>
</head>

<body>
    <div id="logo">Twinkle</div>

    <section id="loginsec">
        <h1 id="intro">Sign in</h1>
        <?php
            $username = $password = $loginErr = "";
            if($_SERVER["REQUEST_METHOD"] == "POST") {
                if(isset($_POST['username'])) { // Checking the request, this might need to be removed....
                    $username = htmlspecialchars($_POST['username']);
                    $password = htmlspecialchars($_POST['password']);
                    if(login($username, $password)) {
                        $_SESSION['username'] = $username;
                        $_SESSION['password'] = $password;
                        header("Location: homepage.php");
                    } else
                        $loginErr = "Invalid username and password combination";
                }
            }
        ?>
        <form method='post' name='login'>
        <label for='username'>Username</label><br>
        <input name='username' id='username' type='text' placeholder='Username' required autocomplete='off' maxlength='30'><br>
        <label for='password'>Password</label><br>
        <div id="passwordContainer">
            <input name='password' id='password' type='password' placeholder='Password' required onkeyup='showPass()'><br>
            <img src='iconList/eye-solid.svg' id='showpass' onclick='changepass()'>
        </div>
        <label class='checkc'>
            <input type='checkbox' id='remember'> <span>Remember me</span>
            <span id='checkin'></span>
        </label>
        <input name='login' type='submit' value='Login' id='login'><br>
        <div id='resetpass'>
            <a href='#'>Forgot password?</a>
        </div>
        <div id='signbottun'>
            <a href='signup.php'>Sign up</a>
        </div>
        <br/>
        <?php echo "<span class='error'>$loginErr</span><br/>"; ?>
        </form>
    </section>
    <script src="scripts/signin.js"></script>
</body>

</html>