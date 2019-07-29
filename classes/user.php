<?php
class User {
    private $id;

    function __construct($id) {
        $this->id = $id;
    }

    function loadNextPosts($numberOfPosts) {
        // add privillages\friendship\tag name sorting\etc checking here in order to determine displayed posts.
        // consider adding a seperate function for this purpose
        if(empty($_SESSION['posts'])) 
            $posts = DB::query("select * from posts order by date desc limit ".$numberOfPosts);
        else
            $posts = DB::query("select * from posts where date < '".$this->getLastPost()."' order by date desc limit ".$numberOfPosts);
        $loggedUserId = DB::getLoggedUserInfo("id")["id"];
        $arr = array();
        foreach($posts as $post) {
            $postObject = new Post($post['id']);
            array_push($arr, $postObject); // consider rethinking
            $postObject->displayPost($loggedUserId); // consider rethinking
        }
        $_SESSION['posts'] = array_merge(array_reverse($arr), $_SESSION['posts']);
    }

    function getLastPost() { // todo: change how i determine last post
        return DB::queryScalar("select date from posts where id=".$_SESSION['posts'][0]->id);
    }
}
?>