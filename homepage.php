<?php
    require_once("classes/queries.php");
    require_once("classes/user.php");
    require_once("classes/posts.php");
    require_once("classes/comment.php");
    require_once("classes/reply.php");
    session_start();
    DB::connect();

    if(!DB::isLoggedIn()) {
        header("Location: signin.php");
        exit("Not logged in.");
    }
    $user = new User(DB::getLoggedUserInfo("id")["id"]);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="theme-color" content="#001942">
    <link rel="stylesheet" media="screen and (min-width: 650px)" href="styles/homepageD.css">
    <link rel="stylesheet" media="screen and (max-width: 650px)" href="styles/homepageM.css">
    <link rel="stylesheet" href="styles/sidenav.css" type="text/css">
    <link rel="stylesheet" href="styles/UploadPostD.css" media="screen and (min-width: 600px)" type="text/css">
    <link rel="stylesheet" href="styles/UploadPostm.css" media="screen and (max-width: 600px)" type="text/css">
    <link rel="stylesheet" href="styles/posts.css" type="text/css" >
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">
    <link rel="stylesheet" href="styles/Postsview.css" type="text/css"/>
    <title>Home page Twinkle</title>

    <style>
        #friendsListContainer {
            position: fixed;
            width: 225px;
            bottom: 0;
            right: 0;
            background: lightblue;
        }
        #friendsListContainer > h3 {
            padding-bottom: 15px;
            padding-top: 15px;
            margin-bottom: 0px;
            margin-top: 0px;
            text-align: center;
            cursor: pointer;
            background: #a9ceda;
        }
        #friendsList {
            display: none;
            list-style-type: none;
            padding-left:0px;
            margin-bottom: 0px;
        }
        .friend {
            padding-top: 10px;
            height: 25px;
            color: indigo;
            cursor: pointer;
            text-align:center;
            background: cornflowerblue;
        }
        .friend:hover {
            opacity: 0.7;
        }
    </style>
</head>

<body>
<?php
    /* NOTE: $_SESSION['post'] is ordered from earliest to latest      */
    /* NOTE: Post.posts[item].index is ordered from earliest to latest */
    // todo: delete posts and files of posts when deleting users (delete files before posts)
    // todo: make post failed errors not in the posts box (because it disappears and you need to reopen it to see the error)
    include_once("templates/Postsview.php");
?>
<header>
    <nav id="navi">
        <ul>
        <span id="sidenavbutton" onclick="openNav()">&#9776;</span>
            <li class="computer"><a><img alt="searchIcon" src="/iconList/searchWhite.png" class="searchIcon"></a></li>
            <li class="displayDis iconset"><a href="#"><img alt="user" src="/iconList/userwhite.png" class="usericon"></a></li>
            <li class="displayDis iconset"><a href="#"><img alt="notifications" src="/iconList/FilledStar.png" class="notifi"></a></li>
            <li class="displayDis iconset"><a href="#"><img alt="note" src="/iconList/notewhite.png" class="navnote"></a></li>
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
<div class="Popcon">
    <div class="Postpop">
        <div class="texter">
            <textarea rows="3" cols="50" placeholder="Express your thoughts..."></textarea>
        </div>
        <div class="postypes">
            <div><span>POST</span></div>
            <div><span>LIMITED</span></div>
        </div>
        <div class="filterchoice">
            <input name="filter" type="text" placeholder="Filter Tag..." maxlength="30"/>
            <div class="Tagdisplay">
                <ul>
                    <li class="Tag"><span>CooL</span><span id="delete">&#120;</span></li>
                </ul>
            </div>
            <div class="drop">
                <ul>
                    <li onclick="setC(this)" >HUMOR<div class="markup"></div></li>
                    <li onclick="setC(this)" >ART<div class="markup"></div></li>
                    <li onclick="setC(this)" >SPORT<div class="markup"></div></li>
                    <li onclick="setC(this)" >TECH<div class="markup"></div></li>
                    <li onclick="setC(this)" >FOOD<div class="markup"></div></li>
                    <li onclick="setC(this)" >NATURE<div class="markup"></div></li>
                </ul>
            </div>
        </div>
        <div class="uploadinfo">
            <div class="watchsort">
                <select>
                    <option value="Global">Global</option>
                    <option value="Private">Private </option>
                </select>
                <div>
                    <input type="text" name="watchsorting" class="inputsort" placeholder="Block from..." />
                    <div class="searchlist">
                        <ul id="myul">
                            <li><a href="#">Jeff Bezos</a></li>
                            <li><a href="#">Bill Gates</a></li>
                            <li><a href="#">Warren Buffett</a></li>
                            <li><a href="#">Bernard Arnault</a></li>
                            <li><a href="#">Mark Zuckerberg</a></li>
                            <li><a href="#">Amancio ortega</a></li>
                            <li><a href="#">Carlos Slim Helu</a></li>
                            <li><a href="#">Charles Koch</a></li>
                            <li><a href="#">David Koch</a></li>
                            <li><a href="#">Larry Ellison</a></li>
                            <li><a href="#">Kobe Mizrahi</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="uploadbutton" onclick="uptoLoad()">
                <input id="fileUpload" class="upload" name="fileUpload" type="file">
                <span>image/video</span>
            </div>

            <div class="imageshow">
                <div class="imagecon">
                <img alt="Preview of the uploaded file" src="//:0" draggable="false" id="filePreview" />
                </div>
                <div><span id="closeImg">&#120;</span></div>
            </div>
        </div>
        <span id="errorMessage"></span>
        <div class="DeclareBtn">
            <button type="submit" class="declareBtn">DECLARE</button>
        </div>
    </div>
</div>
<?php
    include_once("templates/sidenav.php");
?>

<main>
    <div class="Placeholdercontainer" onclick="Postpop()">
        <div class="Placeholderrole">
            <div class="placeholder-img">
                <img src="<?php echo profilePic(DB::getLoggedUserInfo("profilePic")["profilePic"]);?>" alt="some img">
            </div>
            <div class="placeholder-text">
                <span>Express your thoughts...</span>
            </div>
        </div>
    </div>
    <div id="posts">
        <?php
            // https://stackoverflow.com/questions/1370951/what-is-phpsessid
            // after looking at that ^^^ change all session occurances to match new cookie setup
            // todo: add error checking (i.e. exceptions)
            // todo: change fetch_assoc methods to queryScalar if needed through out this project
            // todo: change authentication way (and add first & last name) to tokens, and change session variable stored about username aswell (also for security purposes)
            // todo: fix bug crash when uploading a video (possibly by size or thumbnail)
            // todo: add preview of uploading videos
            // todo: auto logout after a time period
            // todo: rename all xId (id case insensitive) to xi and update in code
            // consider changing posts table's userid to username for it is unique as well
            // consider distinguishing between images and videos when stored
            // consider changing post label for reply\comment forms to actualy sumbit buttons
            // consider making a load function that makes an ajax call for a more modular approch. note: it will be in js, using ajax and load.php
            // consider not storing totalStars for posts (benchmark?)
            $_SESSION['posts'] = array();
            function profilePic($picName) {
                return ($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName;
            }
        ?>
    </div>
</main>

<div id="friendsListContainer">
    <h3>Friends</h3>
    <ul id="friendsList">
        <?php
            $friends = DB::query("select users.firstname from users
                                inner join friends on
                                (users.id = friends.user1 and friends.user2 = ".$user->id.") or (users.id = friends.user2 and friends.user1 = ".$user->id.")");
            if($friends != null) {
                foreach ($friends as $friend) {
                    $nameString = htmlspecialchars($friend['firstname'], ENT_QUOTES);
                    echo "<li class='friend'><a href='profile.php?user=$nameString'>$nameString</a></li>";
                }
            }
        ?>
    </ul>
</div>
<script>
    "use strict"
    document.querySelector("#friendsListContainer > h3").addEventListener("click", (function() {
        var clicked = false;
        return function() {
            if(clicked) {
                clicked = false;
                this.nextElementSibling.style.display = "none";
            } else {
                this.nextElementSibling.style.display = "block";
                clicked = true;
            }
        };
    })());
</script>
<div id="progress">
    <div id="bar">0%</div>
</div>
<script src="scripts/homepage.js"></script>
<script src="scripts/sidenav.js"></script>
<script src="scripts/postDOM.js"></script>
<script src="scripts/commentDOM.js"></script>
<script src="scripts/replyDOM.js"></script>
<script src="scripts/posts.js"></script>
<script src="scripts/video.js"></script>
<script src="scripts/UploadPost.js"></script>
<script type="text/javascript" src="scripts/Postsview.js" ></script>
</body>

</html>