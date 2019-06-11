<?php
    require_once("classes/queries.php");
    require_once("classes/user.php");
    require_once("classes/posts.php");
    require_once("classes/comment.php");
    require_once("classes/reply.php");
    session_start();
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
    <link rel="stylesheet" href="styles/ProfileM.css" media="screen and (max-width:750px)" type="text/css" />
    <link rel="stylesheet" href="styles/ProfileD.css" media="screen and (min-width:750px)" type="text/css" />
    <link rel="stylesheet" href="styles/headerD.css" media="screen and (min-width: 650px)" type="text/css">
    <link rel="stylesheet" href="styles/headerM.css" media="screen and (max-width: 649px)" type="text/css">
    <link rel="stylesheet" href="styles/posts.css" type="text/css" >
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">
    <title>First Name - Twinkle</title>
</head>
<body>
<?php
include_once("templates/header.php");
include_once("templates/sidenav.php");
?>
<div class="Top-container">
    <div class="Tc-info">
        <div class="Free-speech phone"><span>This is a fucking free speech and you can say whatever the fuck you want to say
                This is a fucking free speech and you can say whatever the fuck you want to say
                This is a fucking free speech and you can say whatever the fuck you want to say
        </span>
        </div>
        <div class="computer">
            <div class="linepos">
                <div class="firstline-cont"><span>Friends</span></div> <div class="secondline-cont"><span>59</span></div>
            </div>
            <div class="linepos">
                <div class="firstline-cont"><span>Total</span></div>
                <div class="secondline-cont">
                    <img src="iconList/FilledStar.png" alt="Star" style="width:15px; height:15px;">
                    <span>55,320</span>
                </div>
            </div>
        </div>
        <div class="Avg-info">
            <div>
                <div class="Avg-title"><span>Avg.</span></div>
                <div class="Avg-cont">
                    <img src="iconList/FilledStar.png" alt="Star" style="width:25px; height:25px;">
                    <span>3.4</span>
                </div>
            </div>
        </div>
        <div class="info-buttons">
            <div class="linepos phone">
                <div class="firstline-cont"><span>Friends</span></div> <div class="secondline-cont"><span>59</span></div>
            </div>
            <div class="linepos">
                <div class="firstline-cont"><span>Uploads</span></div> <div class="secondline-cont"><span>349</span></div>
            </div>
            <div class="linepos phone">
                <div class="firstline-cont"><span>Total</span></div>
                <div class="secondline-cont">
                    <img src="iconList/FilledStar.png" alt="Star" style="width:15px; height:15px;">
                    <span>55,320</span>
                </div>
            </div>
            <div class="linepos">
                <div class="firstline-cont"><span>Activity</span></div> <div class="set-activetime"><span>2 hours ago</span></div>
            </div>
        </div>
    </div>

    <div class="central-info">
        <div class="friend-button">
            <img src="iconList/newFriend.png" alt="Add Friend" title="Add Friend" style="width:50px; height:50px;">
        </div>
        <div class="fullname">
            <span>Yehuda Daniel</span>
        </div>
        <div class="profilepic">
            <div>
                <img src="iconList/image.jpg" alt="Profile" style="width:100%; height:auto;">
            </div>
        </div>
        <div class="message-button">
            <div>
                <img src="iconList/comment.png" alt="Message" title="Message" style="width:60px; height:35px;">
            </div>
        </div>
    </div>
    <div class="Free-speech computer">
        <span>
            This is a fucking free speech and you can say whatever the fuck you want to say
            This is a fucking free speech and you can say whatever the fuck you want to say
            This is a fucking free speech and you can say whatever the fuck you want to say
        </span>
    </div>
</div>

<main>

<div class="leftSecCon">
    <div class="postPrese">
        <ul>
<!--the square of the post presentation-->
            <li>
                <div class="postPreview">
                    <div class="PreviewimgCon">
                        <img src="iconList/YDSign.png" alt="Uploaded Image" />
                    </div>
                    <div class="bc-cover">
                        <div class="starsAmount">
                            <div>
                                <img src="/iconList/FilledStar.png" alt="Star">
                            </div>
                            <span>11,007</span>
                        </div>
                    </div>
                </div>
            </li>

            <li>
                <div class="postPreview">
                    <div class="PreviewimgCon">
                        <img src="iconList/YDSign.png" alt="Uploaded Image" />
                    </div>
                    <div class="bc-cover">
                        <div class="starsAmount">
                            <div>
                                <img src="/iconList/FilledStar.png" alt="Star">
                            </div>
                            <span>11,007</span>
                        </div>
                    </div>
                </div>
            </li>

            <li>
                <div class="postPreview">
                    <div class="PreviewimgCon">
                        <img src="iconList/YDSign.png" alt="Uploaded Image" />
                    </div>
                    <div class="bc-cover">
                        <div class="starsAmount">
                            <div>
                                <img src="/iconList/FilledStar.png" alt="Star">
                            </div>
                            <span>11,007</span>
                        </div>
                    </div>
                </div>
            </li>

            <li>
                <div class="postPreview">
                    <div class="PreviewimgCon">
                        <img src="iconList/YDSign.png" alt="Uploaded Image" />
                    </div>
                    <div class="bc-cover">
                        <div class="starsAmount">
                            <div>
                                <img src="/iconList/FilledStar.png" alt="Star">
                            </div>
                            <span>11,007</span>
                        </div>
                    </div>
                </div>
            </li>

            <li>
                <div class="postPreview">
                    <div class="PreviewimgCon">
                        <img src="iconList/YDSign.png" alt="Uploaded Image" />
                    </div>
                    <div class="bc-cover">
                        <div class="starsAmount">
                            <div>
                                <img src="/iconList/FilledStar.png" alt="Star">
                            </div>
                            <span>11,007</span>
                        </div>
                    </div>
                </div>
            </li>

            <li>
                <div class="postPreview">
                    <div class="PreviewimgCon">
                        <img src="iconList/YDSign.png" alt="Uploaded Image" />
                    </div>
                    <div class="bc-cover">
                        <div class="starsAmount">
                            <div>
                                <img src="/iconList/FilledStar.png" alt="Star">
                            </div>
                            <span>11,007</span>
                        </div>
                    </div>
                </div>
            </li>

        </ul>
    </div>
</div>

<div id="postsCon">
<?php
$userid = 2;
$posts = DB::query("select id from posts where userid=$userid");
foreach ($posts as $post) {
    $postObject = new Post($post["id"]);
    $postObject->displayPost($userid);
}
function profilePic($picName) {
    return ($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName;
}
?>
</div>
</main>


    <script src="scripts/sidenav.js"></script>
    <script src="scripts/header.js"></script>
</body>
</html>