<?php
    session_start();
    require_once("classes/queries.php");
    DB::connect();

    if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
        if(!DB::userExists($_SESSION['username'], $_SESSION['password']))
            header("Location: signin.php");
    }
    else
        header("Location: signin.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/homepage.css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="stylesheet" href="styles/posts.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">

    <title>Homepage Twinkle</title>
</head>

<body>
<header>
    <nav id="navi">
        <ul>
        <span id="sidenavbutton" onclick="openNav()">&#9776;</span>
            <li><a href="#"><img alt="user" src="/iconList/userwhite.png" class="usericon"></a></li>
            <li><a href="#"><img alt="notifications" src="/iconList/FilledStar.png" class="notifi"></a></li>
            <li><a href="#"><img alt="note" src="/iconList/notewhite.png" class="note"></a></li>
            <input name="searchbar" type="search" placeholder="Popularities..." id="searchBar"/>
        </ul>
        <span><a href="homepage.php" id="logo">Twinkle</a></span>
    </nav>
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
</header>

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
                $_SESSION['postIds'] = array();
                $posts = DB::query("SELECT * FROM `posts` ORDER BY `date` DESC");
                // consider changing posts table's userid to username for it is unique as well
                // consider distinguishing between images and videos when stored
                foreach($posts as $post) { // consider rethinking the way to show posts, comments (fewer queries)
                    array_push($_SESSION['postIds'], $post['id']);
                    $userInfo = DB::query("SELECT `username`,`profilePic` FROM `users` WHERE `id`='".$post['userID']."'")->fetch_assoc();
                    echo 
                    "<div class='postcon'>
                        <div class='contentcon'>  
                            <div class='topdata'>
                                <span class='fas fa-star avgstar'></span>
                                <span class='avgstardata'>".round(DB::query("select avg(stars) as average from postsstars where postID = ".$post['id'])->fetch_assoc()['average'], 2)."</span>
                                <span class='optionicon'><img alt='options' src='/iconList/ArrowDown.png' style='width:22px; height:15px;' class='more'></span>
                                <div class='topoptions'>
                                    <div class='optionscon'>
                                        <ul>
                                            <li><a href='#'>Report</a></li>
                                            <li><a href='#'>Feed back</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class='Vcon'>";
                            if(isImage($post['fileUploaded']) !== false)
                                echo "<image src='uploads/".$post['fileUploaded']."' alt='posted image'>";
                            else {
                                echo 
                                    "<div class='topbar'>
                                        <div class='juicecon'>
                                            <div class='TimeCount'> <span class='curtime'>0:00</span> <span>/</span> <span class='durtime'>0:00</span></div>
                                            <div class='linediv'>
                                                <div class='juicebar'></div>
                                                <div class='juicemark'></div>
                                                <div class='videojump'></div>
                                            </div>
                                        </div>
                                    </div>
                                    <video class='video' src='uploads/".$post['fileUploaded']."#t=0.1' alt='Posted video'>Your browser do not support videos. You may want to consider upgrading it.</video>
                                    <div class='playanime'></div>
                                    <div class='pauseanime'></div>
                                    <div class='bottombar'>
                                        <div class='left'>&#x276E;</div>
                                        <div class='extracon'>
                                            <div class='volume'> <img alt='volume' src='/iconList/Volumeoff.png' class='volumeicon'> </div>
                                            <!-- <div><span class='screenicon'></span></div> -->
                                        </div>
                                        <div class='control'>
                                            <button class='play-pause'></button>
                                        </div>
                                        <div class='right'>&#x276F;</div>
                                    </div>";
                            }

                            echo
                            "</div>

                            <div class='bottomdata'>
                                <div class='starrate'>
                                    Total stars: <span class='stars'>".$post['totalStars']."</span> |";
                                    $userid = DB::query("SELECT `id` FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id'];
                                    $stars = DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userid."' AND `postID`='".$post['id']."'")->fetch_assoc()['stars'];
                                    for ($i=0; $i < $stars; $i++)
                                        echo "<img alt='star' src='/iconList/FilledStar.png' class='star'>";
                                    for ($i=$stars; $i < 5; $i++)
                                        echo "<img alt='star' src='/iconList/RateStar.svg' class='star'>";
                                echo
                                "</div>
                                <div class='Avgdata'>
                                    <img alt='Users Amount' src='/iconList/User.png' class='UserAm'><span class='usernum'>234</span>
                                </div>
                            </div>

                            <div class='contentData'>
                                <div class='postowner'>
                                    <img alt='User profile photo' src='".profilePic($userInfo['profilePic'])."' class='ownerphoto'>
                                    <a class='ownerfullname' href=profile.php?user=".$userInfo['username'].">".$userInfo['username']."</a>
                                </div>

                                <div class='date'><span class='datenum'>".$post['date']."</span></div>
                            </div>

                            <div class='descript'>".htmlspecialchars($post['content'])."</div>

                            <div class='acts'>
                                <div class='act1'>
                                    <a>
                                        <span>Comment</span>
                                    <img alt='comment' src='/iconList/comment.png' class='comment' style='width:40px; height:30px;'>
                                    </a>
                                </div>
                                <div class='act2'>
                                        <a>
                                            <span>Note</span>
                                        <img alt='Note Button' src='/iconList/note.png' class='note' style='width:30px; height:30px;'>
                                        </a>
                                </div>
                                <div class='act3'>
                                    <a href='#'>
                                        <span>Send</span>
                                    <img alt='Send it' src='/iconList/Sendit.png' class='send' style='width:30px; height:30px;'>
                                    </a>
                                </div>
                            </div>

                            <form method='post' name='compost' class='comform'>
                                    <input name='typecom' type='text' placeholder='Share your thoughts..' autocomplete='off'>
                                    <label for='typcom' class='submit'>></label>
                            </form>
                            <div class='comments'>
                                <h2>Comments</h2>";

                                $postComments = DB::query("select * from comments where isPostComment=true and itemCommentedId=".$post['id']." order by date asc");
                                foreach($postComments as $comment) {
                                    $commentingUser = DB::query("select * from users where id=".$comment['userid'])->fetch_assoc();
                                    echo
                                    "<div class='newarea'>
                                        <div class='commentsarea'>
                                            <div class='userD'>
                                                <a href='profile.php?user=".$commentingUser["username"]."' class='userN'>
                                                    <img alt='profile photo' src='".profilePic($commentingUser["profilePic"])."' class='selfimg'/>
                                                    ".$commentingUser["username"]."
                                                </a>
                                                <span class='commdate'>".$comment['date']."</span>
                                            </div>
                                            <div class='commentcont'>".$comment['content']."</div>
                                            <div class='comset'>
                                                <span class='comreply'>reply</span> <span class='comnote'>note</span>
                                            </div>
                                        </div>

                                        <form method='post' name='replyform' class='replyform'>
                                            <input name='typerep' type='text' placeholder='Reply...' autocomplete='off'>
                                        </form>";

                                        displayCommentComments($comment["id"]);
                                echo "</div>";
                                }
                            echo
                            "</div>
                        </div>
                    </div>";
                }
                function isImage($fileName) {
                    return array_search(pathinfo($fileName, PATHINFO_EXTENSION), array("jpeg", "jpg", "png"));
                }
                function profilePic($picName) {
                    return ($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName;
                }

                function displayCommentComments($commentId) {
                    $commentComments = DB::query("select * from comments where isPostComment=false and itemCommentedId=".$commentId);
                    $commentComment;
                    while(($commentComment = $commentComments->fetch_assoc()) !== null) {
                        $commentingUser = DB::query("select * from users where id=".$commentComment['userid'])->fetch_assoc();
                        echo
                        "<div class='replydiv'>
                            <div class='userD'>
                                <a href='profile.php?user=".$commentingUser["username"]."' class='userN'>
                                    <img alt='profile photo' src='".profilePic($commentingUser["profilePic"])."' class='selfimg'/>
                                    ".$commentingUser["username"]."
                                </a>
                                <span class='commdate'>".$commentComment['date']."</span>
                            </div>
                            <div class='replycont'>".$commentComment['content']."</div>
                            <div class='comset'>
                                <span class='comreply'>reply</span> <span class='comnote'>note</span>
                            </div>".
                            displayCommentComments($commentComment["id"]).
                        "</div>";
                    }
                }
            ?>
        </div>
    </main>
    <script src="scripts/homepage.js"></script>
    <script src="scripts/sidenav.js"></script>
    <script src="scripts/posts.js"></script>
</body>

</html>