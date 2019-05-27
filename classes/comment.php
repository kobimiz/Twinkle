<?php
class Comment {
    public $id;
    public $repliesIds = array();

    function __construct($id) {
        $this->id = $id;
    }
    public function displayComment($loggedUserId) {
        $comment = DB::query("select * from comments where id=".$this->id)->fetch_assoc();
        $replies = DB::query("select * from replies where commentId=".$comment['id']." order by date desc, id desc");
        $commentingUser = DB::query("select username, profilePic from users where id=".$comment['userid'])->fetch_assoc();
        echo
        "<div class='newarea'>
            <div class='commentsarea'>
                <div class='userD'>
                    <a href='profile.php?user=".htmlspecialchars($commentingUser["username"])."' class='userN'>
                        <img alt='Profile photo' src='".profilePic($commentingUser["profilePic"])."' class='selfimg'/>"
                        .$commentingUser["username"].
                    "</a>
                    <span class='commdate'>".$comment['date']."</span>
                </div>

                <div class='commentcont'>".htmlspecialchars($comment['content'])."</div>
                <div class='comset'>
                    <span class='comreply'>reply</span>
                    <span class='comnote'>note</span>";
            if($comment["userid"] === $loggedUserId)
                echo "<span class='comdelete'>delete</span>";
            echo
                "</div>
            </div>

            <div class='replyform'>
                <input name='typerep' type='text' placeholder='Reply...' autocomplete='off'>
                <button class='submit'>></button>
            </div>";
            
            if($replies->num_rows > 0) 
        echo "<span class='viewMoreReplies'>View replies</span>";
            echo
            "<div class='replies'>";
                foreach($replies as $reply) {
                    Reply::displayReply($reply, $loggedUserId);
                    array_push($this->repliesIds, $reply['id']);
                }
        echo
            "</div>
        </div>";
    }
}

?>