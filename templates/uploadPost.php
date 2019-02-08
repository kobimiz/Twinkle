<?php
    // note: file_uploads must be on in the php.ini file
    // note: upload_max_filesize must be set to 20M in php.ini
    // note: post_max_size must be set to 20M in php.ini (refresh wamp after editing php.ini)
    // consider checking file name with preg_match("`^[-0-9A-Z_\.]+$`i",$filename)
    // consider checking file isn't empty
    // consider changing userid to username posts, since it is easier to get
    session_start();
    require_once("connection.php");
    require_once("functions.php");
    if(isset($_FILES["file"])) {
        $target_dir = __DIR__."\\..\\uploads\\";
        $target_file = $target_dir.basename($_FILES["file"]["name"]);
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        if($_FILES["file"]["size"] > 20000000) // file size greater than 20mb
            echo "too big";
        else {
            $arr = array("jpeg", "jpg", "png", "gif", "avi", "amv", "mp4");
            if(array_search($fileType, $arr) === false)
                echo "invalid type";
            else {
                if(!file_exists($target_file)) {
                    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
                        echo "success";
                        postDbUpdate();
                    }
                    else
                        echo "error";
                } else {
                    //https://stackoverflow.com/questions/21076428/php-file-exist-with-regex
                    $dir = new DirectoryIterator("\..\uploads");
                    $pattern = '/^' . preg_quote($css_prefix) . '.+\\.css$' . '/';
                    var_dump($pattern);
                    // foreach ($dir as $fileInfo) {
                    //     if (preg_match($pattern, $fileInfo->getBaseName())) {
                    //         // match!
                    //     }
                    // }
                    // IMPORTANT: CHANGE ADDED (NUM) TO BEFORE FILE EXTENTION AND PUSH TO YEHUDA
                    // $res = array();
                    // preg_match("/\s\([\d]+(?=\)\.)/", $_FILES["file"]["name"], $res);
                    // if(empty($res)) { // the pattern (number) was not found, add (2) to name
                    //     $_FILES["file"]["name"] = substr(0, strpos($_FILES["file"]["name"], "."));
                    //     $target_file = $target_dir.basename($_FILES["file"]["name"]); // $_FILES["file"]["name"] has changed
                    //     if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
                    //         echo "success";
                    //         // postDbUpdate();
                    //     }
                    //     else
                    //         echo "error";
                    // }
                    // else { // the patten (number) was found, increase number by 1
                    //     $number = substr($res[0], 0, 2);
                    //     echo $number;
                    // }


                    // $endIndex = preg_match("/\s\([\d]+\)\./", $_FILES["file"]["name"]);
                    // if($endIndex === 0) // has no "(num)" at the end (no way that endindex would be the first index)
                    //     $_FILES["file"]["name"] = $_FILES["file"]["name"]."(2)";
                    // else {
                    //     $startIndex = preg_match("/(?!\.)\(\d/", $_FILES["file"]["name"]) + 1;
                    //     $fileNumber = substr($_FILES["file"]["name"], $startIndex, $endIndex);
                    //     $_FILES["file"]["name"] = $_FILES["file"]["name"]."(".((int)$fileNumber + 1).")";
                    // }
                    // $target_file = $target_dir.basename($_FILES["file"]["name"]); // $_FILES["file"]["name"] has changed
                    // if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
                    //     echo "success";
                    //     postDbUpdate();
                    // }
                    // else
                    //     echo "error";
                }
            }
        }
    } else if(isset($_SESSION["username"]))
        header('Location: /../homepage.php');
    else
        header('Location: /../signin.php');

    function postDbUpdate() {
        global $connection;
        $query = "INSERT INTO `posts`(`userID`, `date`, `content`, `fileUploaded`, `totalStars`) VALUES ('".
        details($_SESSION['username'], $_SESSION['password'])["id"].
        "', '".date("Y-m-d H:i:s").
        "', '".$_POST['content'].
        "', '".$_FILES["file"]["name"].
        "', '0')";
        $sql = mysqli_query($connection, $query);
    }
?>