<?php
class User {
    public $id;

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
        if($posts->num_rows > 0) { 
            $loggedUserId = DB::getLoggedUserInfo("id")["id"];
            $arr = array();
            foreach($posts as $post) {
                $postObject = new Post($post['id']);
                array_push($_SESSION['posts'], $postObject); // consider rethinking
                array_push($arr, $postObject->getPost($loggedUserId));
            }
            echo json_encode($arr);
        }
    }

    function getLastPost() { // todo: change how i determine last post
        return DB::queryScalar("select date from posts where id=".$_SESSION['posts'][count($_SESSION['posts']) - 1]->id);
    }
}
?>