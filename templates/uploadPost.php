<?php
    // note: file_uploads must be on in the php.ini file
    // note: upload_max_filesize must be set to 20M in php.ini
    // note: post_max_size must be set to 20M in php.ini (refresh wamp after editing php.ini)
    // consider checking file name with preg_match("`^[-0-9A-Z_\.]+$`i",$filename)
    // consider checking file isn't empty
    // consider changing userid to username posts, since it is easier to get
    // preg_match("/\s\([\d]+(?=\)\.)/", $_FILES["file"]["name"], $res); <--- random thing i want to keep for a while
    require_once(__DIR__."/../classes/queries.php");
    require_once(__DIR__."/../classes/posts.php");
    session_start();
    DB::connect();
    if(isset($_FILES)) {
        $username = DB::getLoggedUserInfo("username")["username"];
        $target_dir = __DIR__."/../uploads/";
        $target_file = $target_dir.basename($_FILES["file"]["name"]);
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        $_FILES["file"]["name"] = randomizeName().".".$fileType; // <------------- consider removing the data about the real name of the file being uploaded in homepage.php
        $target_file = $target_dir.basename($_FILES["file"]["name"]); // file name has changed!
        $arr = array("jpeg", "jpg", "png", "gif", "avi", "amv", "mp4");

        if(array_search($fileType, $arr) === false)
            echo "invalid type,";
        else if($_FILES["file"]["size"] > 20000000) // file size greater than 20mb
            echo "too big,";
        else if(!move_uploaded_file($_FILES["file"]["tmp_name"], $target_file))
            echo "error";
        else {
            DB::query("INSERT INTO `posts`(`userID`, `date`, `content`, `fileUploaded`, `totalStars`) VALUES ('".
                DB::query("SELECT * FROM `users` WHERE `username`='".$username."'")->fetch_assoc()["id"].
                "', '".date("Y-m-d H:i:s").
                "', '".addslashes($_POST['content']).
                "', '".$_FILES["file"]["name"].
                "', '0')");
            echo "success,";

            array_splice($_SESSION['posts'], 0, 0, array(new Post(DB::insertId()))); // insert a new post in the beggining
        }
    } else if(isset($username)) // todo: handle file serving (so i can get rid of this)
        header('Location: /../homepage.php');
    else
        header('Location: /../signin.php');

    $picName = DB::query("select profilePic from users where username='".$username."'")->fetch_assoc()['profilePic'];
    echo $username.",".$_FILES["file"]["name"].",".$_POST['content'].",".(($picName === "") ? "/iconList/"."user.png":"/uploads/".$picName);
    function randomizeName() { // 10 lowercase letters/digits characters long
        $name = "";
        for ($i=0; $i < 10; $i++) {
            if(rand(0,1) === 0)
                $name .= chr(rand(97,122));
            else
                $name .= rand(0,9);
        }
        if(!file_exists(__DIR__."/../uploads/".$name))
            return $name;
        return randomizeName();
    }
?>