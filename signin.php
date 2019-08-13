<?php
    require_once("classes/queries.php");
    DB::connect();
    $loginErr = "";
    if($_SERVER["REQUEST_METHOD"] == "POST") {
        if(isset($_POST['login'])) { // Checking the request, this might need to be removed....
            $username = $_POST['username'];
            $password = $_POST['password'];
            if(DB::userExists($_POST['username'], $_POST['password'])) {
                $loggedInUserId = DB::isLoggedIn();
                $userSumbittedId = DB::queryScalar("select id from users where username='".$_POST['username']."'");
                // if not logged in, or trying to log in from a different account- either case give a new cookie and a loginToken
                if(!$loggedInUserId || $loggedInUserId !== $userSumbittedId) {
                    if($loggedInUserId) // trying to login from a different account
                        DB::query("delete from loginTokens where token='".sha1($_COOKIE["SNID"])."'");
                    $cstrong = true;
                    $token = bin2hex(openssl_random_pseudo_bytes(64, $cstrong));
                    DB::query("insert into loginTokens (token, userid) values ('".sha1($token)."', ".$userSumbittedId.")");
                    // valid for 1 week IMPORTANT: if website hosted over ssl make before last parameter true. same for second cookie
                    setcookie("SNID", $token, time() + 60 * 60 * 24 * 7, '/', NULL, NULL,  TRUE);
                    setcookie("SNID_", '1', time() + 60 * 60 * 24 * 3, '/', NULL, NULL,  TRUE);
                }
                header("Location: homepage.php");
            } else
                $loginErr = "Incorrect username or password";
        }
    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="theme-color" content="#001942">
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">
    <link rel="stylesheet" href="styles/signin.css" type="text/css">
    <link rel="stylesheet" href="styles/general.css" type="text/css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">
    <title>Sign in to Twinkle</title>
</head>

<body>
    <div id="logo"><img src="/iconList/TwinkleR.png" style="width:65px; height:65px;" alt="Twinkle logo" class="Tlogo" > winkle</div>

    <section id="loginsec">
        <div class="topcolor">
            <h1 id="intro">Sign in</h1>
            <img src="/iconList/TwinkleR.png" style="width: 65px; height: 65px;" alt="Twinkle logo" class="TwinkleL">
        </div>
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
            <?php
            if($loginErr != ''){
                echo "<span class='error'>$loginErr</span><br/>"; 
            }
                ?>
            <input name='login' type='submit' value='Login' id='login'><br>
            <div id='resetpass'>
                <a href='#'>Forgot password?</a>
            </div>
            <div id='signbottun'>
                <a href='signup.php'>Sign up</a>
            </div>
            <br />
        </form>
    </section>
    <script src="scripts/signin.js"></script>
</body>

</html>