<?php
class User {
    private $id;
    private $postsLoaded;

    function __construct($id) {
        $this->id = $id;
        $this->postsLoaded = [];
    }

    function loadNextPosts($numberOfPosts) {
        // add privillages\friendship\tag name sorting\etc checking here in order to determine displayed posts.
        // consider adding a seperate function for this purpose
        $posts = DB::query("select * from posts where date > ".$this->getLastPost()." order by date desc limit ".$numberOfPosts);
        foreach($posts as $post) {
            $postObject = new Post($post['id']);
            array_push($_SESSION['posts'], $postObject); // consider rethinking
            array_push($this->postsLoaded, $postObject);
            $postObject->displayPost();
        }
    }

    function getLastPost() { // todo: change how i determine last post
        if(!end($this->postsLoaded)) // array is empty
            return 0;
        return DB::query("select date from posts where id=".end($this->postsLoaded)->id)->fetch_assoc()["date"];
    }
}
?>