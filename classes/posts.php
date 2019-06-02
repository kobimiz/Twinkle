<?php
DB::connect();
// consider adding destructors, and adding replies somehow because they need to be edited somehow
class Post {
    public $id; // consider doing something with public
    public $comments = array();

    function __construct ($id) {
        $this->id = $id;
    }

    function displayPost($loggedUserId) {
        $postingUserId = DB::queryScalar("select userid from posts where id=".$this->id);
        $postingUserInfo = DB::query("SELECT `username`,`profilePic` FROM `users` WHERE `id`='".$postingUserId."'")->fetch_assoc();
        $post = DB::query("select * from posts where id=".$this->id)->fetch_assoc(); // consider a better approach
        $stars = DB::queryScalar("SELECT `stars` FROM `postsstars` WHERE `userID`='".$loggedUserId."' AND `postID`='".$post['id']."'");
        $count = DB::queryScalar("select count(*) from postsstars where postID=".$post['id']);
        echo 
        "<div class='postcon'>
            <div class='contentcon'>  
                <div class='topdata'>
                    <span class='fas fa-star avgstar'></span>
                    <span class='avgstardata'>".round(DB::queryScalar("select avg(stars) from postsstars where postID = ".$this->id), 1)."</span>
                    <span class='optionicon'><img alt='options' src='/iconList/ArrowDown.png' style='width:22px; height:15px;' class='more'></span>
                    <div class='topoptions'>
                        <div class='optionscon'>
                            <ul>";
                        if($postingUserId === $loggedUserId)
                            echo
                                "<li>delete</li>";
                        else {
                            echo
                                "<li><a href='#'>Report</a></li>
                                <li><a href='#'>Feed back</a></li>";
                        }
                        echo
                            "</ul>
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
                            <div class='TimeCount'> <span class='curtime'>0:00</span> <span>/</span> <span class='durtime'></span></div>
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
                            <div class='fullscreen'><img alt='volume' src='/iconList/bigger.png' class='screenicon'> </div>
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
                        for ($i=0; $i < $stars; $i++)
                            echo "<img alt='star' src='/iconList/FilledStar.png' class='star'>";
                        for ($i=$stars; $i < 5; $i++)
                            echo "<img alt='star' src='/iconList/RateStar.svg' class='star'>";
                    echo
                    "</div>
                    <div class='Avgdata'>
                        <img alt='Users Amount' src='/iconList/User.png' class='UserAm'>
                        <span class='usernum'>".$count."</span>
                    </div>
                </div>

                <div class='contentData'>
                    <div class='postowner'>
                        <img alt='User profile photo' src='".profilePic($postingUserInfo['profilePic'])."' class='ownerphoto'>
                        <a class='ownerfullname' href=profile.php?user=".$postingUserInfo['username'].">".$postingUserInfo['username']."</a>
                    </div>

                    <div class='date'>".$post['date']."</div>
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
                            <span>Share</span>
                        <img alt='Share a post' src='/iconList/share.png' style='width:30px; height:30px;'>
                        </a>
                    </div>
                </div>

                <div class='comform'>
                    <input name='typecom' type='text' placeholder='Share your thoughts..' autocomplete='off'>
                    <button class='submit'>></button>
                </div>

                <div class='comments'>";
                    // highly consider coming up with a new way to insure comments are selected as planned
                    $postComments = DB::query("select * from comments where postId=".$post['id']." order by date desc, id desc limit 2");
                    if($postComments->num_rows > 0)
                        echo "<h2>Comments</h2>";
                        
                    foreach($postComments as $comment) {
                        $commentObject = new Comment($comment['id']);
                        $commentObject->displayComment($loggedUserId);
                        array_push($this->comments, $commentObject);
                    }
                    echo
                "</div>
            </div>
        </div>";
    }
}

function isImage($fileName) {
    return array_search(pathinfo($fileName, PATHINFO_EXTENSION), array("jpeg", "jpg", "png"));
}
?>