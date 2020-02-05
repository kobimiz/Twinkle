<?php
class Comment {
    public $id;
    public $repliesIds = array();

    function __construct($id) {
        $this->id = $id;
    }
    public function getComment($loggedUserId) {
        $comment = DB::query("select * from comments where id=".$this->id)->fetch_assoc();
        $commentingUser = DB::query("select username, profilePic from users where id=".$comment['userid'])->fetch_assoc();
        $usernameSpecialchars = htmlspecialchars($commentingUser["username"], ENT_QUOTES);

        $arr = array(
            "properties" => array(
                "commentorProfileLink" => "/profile.php?user=".$usernameSpecialchars,
                "commentorImageSrc"    => DB::profilePic($commentingUser["profilePic"]),
                "commentorName"        => $usernameSpecialchars,
                "date"                 => $comment['date'],
                "content"              => htmlspecialchars($comment['content'], ENT_QUOTES),
                "isViewerCommentor"    => ($comment['userid'] == $loggedUserId)
            ),
            "replies" => array()
        );
        $commentReplies = DB::query("select * from replies where commentId=".$comment['id']." order by date desc, id desc");
        foreach ($commentReplies as $reply) {
            $replyDOM = new Reply($reply['id']);
            array_push($arr["replies"], Reply::getReply($reply, $loggedUserId));
            array_push($this->repliesIds, $reply['id']);
        }
        return $arr;
    }
}


?>