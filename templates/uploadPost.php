<?php
    // note: file_uploads must be on in the php.ini file
    // note: upload_max_filesize must be set to 20M in php.ini
    // note: post_max_size must be set to 20M in php.ini (refresh wamp after editing php.ini)
    // consider checking file name with preg_match("`^[-0-9A-Z_\.]+$`i",$filename)
    // consider checking file isn't empty
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
                        $query = "INSERT INTO `posts`(`userID`, `date`, `content`, `fileUploaded`, `totalStars`) VALUES ('".
                        details($_SESSION['username'], $_SESSION['password'])["id"].
                        "', '".date("Y-m-d H:i:s").
                        "', '".$_POST['content'].
                        "', '".$_FILES["file"]["name"].
                        "', '0')";
                        $sql = mysqli_query($connection, $query);
                    }
                    else
                        echo "error";
                } else {
                    echo "success";
                        $query = "INSERT INTO `posts`(`userID`, `date`, `content`, `fileUploaded`, `totalStars`) VALUES ('".
                        details($_SESSION['username'], $_SESSION['password'])->id.
                        "', '".date("Y-m-d H:i:s").
                        "', '".$_POST['content'].
                        "', '".$_FILES["file"]["name"].
                        "', '0')";
                        $sql = mysqli_query($connection, $query);
                }
            }
        }
    } else if(isset($_SESSION["username"]))
        header('Location: /../homepage.php');
    else
        header('Location: /../signin.php');
?>