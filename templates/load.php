<?php
    require_once(__DIR__."/../classes/queries.php");
    require_once(__DIR__."/../classes/posts.php");
    session_start(); // important to start session after class is loaded, since loading data in session parses them to string and retriving it reparses them to the objects they were
    DB::connect();

    
?>