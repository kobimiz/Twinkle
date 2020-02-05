<?php
DB::connect();
// consider adding destructors, and adding replies somehow because they need to be edited somehow
class Post {
    public $id; // consider doing something with public
    public $comments = array();

    function __construct ($id) {
        $this->id = $id;
    }

    // todo: benchmark the efficiecy of this
    function getPost($loggedUserId) {
        $postingUserId = DB::queryScalar("select userID from posts where id=".$this->id);
        $posterInfo = DB::query("SELECT `username`,`profilePic` FROM `users` WHERE `id`='".$postingUserId."'")->fetch_assoc();
        $sqlRes = DB::query("select * from posts where id=".$this->id)->fetch_assoc();
        $usernameSpecialChars = htmlspecialchars($posterInfo['username'], ENT_QUOTES);
        $post = array("properties" => 
                        array(
                            "mediaSrc"          => "uploads/".$sqlRes["fileUploaded"],
                            "totalStars"        => $sqlRes["totalStars"],
                            "numOfRaters"       => DB::queryScalar("select count(*) from postsstars where postID=".$this->id),
                            "viewerRating"      => DB::queryScalar("SELECT `stars` FROM `postsstars` WHERE `userID`='".$loggedUserId."' AND `postID`='".$this->id."'"),
                            "date"              => $sqlRes["date"],
                            "isViewerPoster"    => ($sqlRes["userID"] == $loggedUserId),
                            "posterName"        => $usernameSpecialChars,
                            "posterProfileLink" => "profile.php?user=".$usernameSpecialChars,
                            "posterImageSrc"    => DB::profilePic($posterInfo['profilePic']),
                            "content"           => htmlspecialchars($sqlRes["content"], ENT_QUOTES)
                        ),
                    "comments" => array()
                );
        $postComments = DB::query("select id from comments where postId=".$this->id." order by date desc, id desc limit 2");
        foreach ($postComments as $comment) {
            $commentObject = new Comment($comment["id"]);
            array_push($post["comments"], $commentObject->getComment($loggedUserId));
            array_push($this->comments, $commentObject);

        }
        return $post;
    }
}

function isImage($fileName) {
    return array_search(pathinfo($fileName, PATHINFO_EXTENSION), array("jpeg", "jpg", "png"));
}
?>