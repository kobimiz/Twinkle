<?php
class User {
    private $id;

    function __construct($id) {
        $this->id = $id;
    }

    function loadNextPosts($numberOfPosts) {
        // add privillages\friendship\tag name sorting\etc checking here in order to determine displayed posts.
        // consider adding a seperate function for this purpose
        $posts = DB::query("select * from posts where date > '".$this->getLastPost()."' order by date asc limit ".$numberOfPosts);
        $loggedUserId = DB::getLoggedUserInfo("id")["id"];
        foreach($posts as $post) {
            $postObject = new Post($post['id']);
            array_push($_SESSION['posts'], $postObject); // consider rethinking
            $postObject->displayPost($loggedUserId); // consider rethinking
        }
    }

    function getLastPost() { // todo: change how i determine last post
        if(empty($_SESSION['posts']))
            return DB::queryScalar("select min(date) from posts");
        return DB::queryScalar("select date from posts where id=".array_slice($_SESSION['posts'], -1)[0]->id);
    }
}
?>