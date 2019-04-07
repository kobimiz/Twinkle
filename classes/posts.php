<?php
    require_once(__DIR__."/../classes/queries.php");
    DB::connect();
    // consider adding destructors, and adding replies somehow because they need to be edited somehow
    class Post {
        public $id; // consider doing something with public
        public $commentsIds = array();

        function __construct ($id) {
            $comments = DB::query("select id from comments where postId=".$id." order by date asc");

            $this->id = $id;
            foreach ($comments as $comment)
                array_push($this->commentsIds, $comment['id']);
        }
    }
?>