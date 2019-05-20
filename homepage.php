<?php
    session_start();
    require_once("classes/queries.php");
    require_once("classes/user.php");
    require_once("classes/posts.php");
    require_once("classes/comment.php");
    require_once("classes/reply.php");
    DB::connect();


    if(!DB::isLoggedIn())
        header("Location: signin.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" media="screen and (min-width: 650px)" href="styles/homepageD.css">
    <link rel="stylesheet" media="screen and (max-width: 650px)" href="styles/homepageM.css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="stylesheet" href="styles/posts.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">

    <title>Home page Twinkle</title>
</head>

<body>
<header>
    <nav id="navi">
        <ul>
        <span id="sidenavbutton" onclick="openNav()">&#9776;</span>
            <li class="computer"><a href="#"><img alt="searchIcon" src="/iconList/searchWhite.png" class="searchIcon"></a></li>
            <li class="displayDis iconset"><a href="#"><img alt="user" src="/iconList/userwhite.png" class="usericon"></a></li>
            <li class="displayDis iconset"><a href="#"><img alt="notifications" src="/iconList/FilledStar.png" class="notifi"></a></li>
            <li class="displayDis iconset"><a href="#"><img alt="note" src="/iconList/notewhite.png" class="note"></a></li>
            <li class="computer displayDis"><a href="#"><img alt="Logo" src="/iconList/TwinkleCon.png" class="TwinkleLogo"></a></li>
            <input name="searchbar" type="search" placeholder="Popularities..." id="searchBar"/>
        </ul>
        <span class="phone"><a href="homepage.php" id="logo"><img class="imgfont" src="/iconList/TwinkleCon.png" alt="Logo" style="width:40px; height:35px;" ><span class="Logofont">winkle</span></a></span>
    </nav>
</header>
<div id="filtering">
    <ul class="filterlist">
        <li><a href="#" class="link">HOME</a></li>
        <li><a href="#" class="link">HUMOR</a></li>
        <li><a href="#" class="link">ART</a></li>
        <li><a href="#" class="link">SPORT</a></li>
        <li><a href="#" class="link">TECH</a></li>
        <li><a href="#" class="link">FOOD</a></li>
        <li><a href="#" class="link">NATURE</a></li>
        <li id="adding"><a href="#" class="plus link">+</a></li>
    </ul>
    <span class="bord"></span>
</div>
    <?php
        include_once("templates/sidenav.php");
    ?>

    <main>
        <div id="uploadPost">
            <h3>Share your thoughts.</h3>
            <textarea name="content" cols="100" rows="10" placeholder="Write your thoughts..."></textarea>
            <img src="" alt="Preview of the uploaded file" id="filePreview">
            <!-- add preview for a video, consider making it an image of the first frame -->
            <br>
            <br>
            <label for="fileUpload">Include an image/video</label>
            <input type="file" id="fileUpload" name="fileUpload">
            <span id="errorMessage"></span>
            <br>
            <input type="button" value="Post" id="post">
            <div id="progress">
                <div id="bar">0%</div>
            </div>
        </div>
        <div id="posts">
            <?php
                // https://stackoverflow.com/questions/1370951/what-is-phpsessid
                // after looking at that ^^^ change all session occurances to match new cookie setup
                // todo: tell yehuda to add new table (loginTokens) and change all tables' storage engine to innoDB & and relations
                // todo: check w\ yehuda if a record (e.g. comment) should be deleted if parent is deleted (e.g. post)
                // todo: add error checking (i.e. exceptions)
                // todo: change fetch_assoc methods to queryScalar if needed through out this project
                // todo: change authentication way (and add first & last name) to tokens, and change session variable stored about username aswell (also for security purposes)
                // todo: fix bug crash when uploading a video (possibly by size or thumbnail)
                // todo: add preview of uploading videos
                // todo: tell yehuda about swapping volume icons in on\off modes
                // todo: auto logout after a time period
                // todo: rename all xId (id case insensitive) to xi and update in code
                // consider changing posts table's userid to username for it is unique as well
                // consider distinguishing between images and videos when stored
                // consider changing post label for reply\comment forms to actualy sumbit buttons
                // consider making a load function that makes an ajax call for a more modular approch. note: it will be in js, using ajax and load.php
                // consider not storing totalStars for posts (benchmark?)
                $_SESSION['posts'] = array();
                $user = new User(DB::getLoggedUserInfo("id")["id"]);
                $user->loadNextPosts(5);
                function profilePic($picName) {
                    return ($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName;
                }
            ?>
            <div id='showMore' style="background:red;display:none;">Show more</div>
        </div>
    </main>
    <script src="scripts/homepage.js"></script>
    <script src="scripts/sidenav.js"></script>
    <script src="scripts/posts.js"></script>
</body>

</html>