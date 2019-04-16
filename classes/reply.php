<?php
class Reply {
    public static function displayReply($reply, $loggedUserId) {
        $replyingUser = DB::query("select username, profilePic from users where id=".$reply['userId'])->fetch_assoc();
        echo
        "<div class='replydiv'>
            <div class='userD'>
                <a href='profile.php?user=".htmlspecialchars($replyingUser["username"])."' class='userN'>
                    <img alt='Profile photo' src='".profilePic($replyingUser["profilePic"])."' class='selfimg'/>".
                    $replyingUser["username"].
                "</a>
                <span class='commdate'>".$reply['date']."</span>
            </div>
            <div class='replycont'>".htmlspecialchars($reply['content'])."</div>
            <div class='comset'>
                <span class='comnote'>note</span>";
        if($reply["userId"] === $loggedUserId) {
            echo
                "<span class='comedit'>edit</span>
                <span class='comdelete'>delete</span>";
        }
        echo
            "</div>".
        "</div>";
    }
}
?>