<?php
class Reply {
    public static function getReply($reply, $loggedUserId) {
        $replyingUser = DB::query("select username, profilePic from users where id=".$reply['userId'])->fetch_assoc();
        $usernameSpecialchars = htmlspecialchars($replyingUser["username"], ENT_QUOTES);
        return array(
            "replierProfileLink" => $usernameSpecialchars,
            "replierImageSrc" => DB::profilePic($replyingUser["profilePic"]),
            "replierName" => $usernameSpecialchars,
            "date" => $reply['date'],
            "content" => htmlspecialchars($reply['content'], ENT_QUOTES),
            "isViewerReplier" => ($reply["userId"] == $loggedUserId)
        );

        
    }
}
?>