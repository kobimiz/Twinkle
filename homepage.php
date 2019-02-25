<?php
    session_start();
    require_once("classes/queries.php");
    DB::connect();

    if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
        if(!DB::userExists($_SESSION['username'], $_SESSION['password']))
            header("Location: signin.php");
    }
    else
        header("Location: signin.php");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="styles/general.css">
    <link rel="stylesheet" href="styles/header.css">
    <link rel="stylesheet" href="styles/homepage.css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <title>Homepage Twinkle</title>
</head>

<body>
    <?php
        include_once("templates/header.php");
        include_once("templates/sidenav.php");
    ?>

    <main>
        <div id="uploadPost">
            <h3>Share your thoughts.</h3>
            <textarea name="content" cols="100" rows="10" placeholder="Write your thoughts..."></textarea>
            <img src="" alt="Preview of the uploaded file" id="filePreview">
            <!-- add preview for a video, consider making it an image of the first frame -->
            <br>
            <br>
            <label for="fileUpload">Include an image/video</label>
            <input type="file" id="fileUpload" name="fileUpload">
            <span id="errorMessage"></span>
            <br>
            <input type="button" value="Post" id="post">
            <div id="progress">
                <div id="bar">0%</div>
            </div>
        </div>
        <div id="posts">
            <?php
                $_SESSION['postIds'] = array();
                $posts = DB::query("SELECT * FROM `posts` ORDER BY `date` DESC");
                // consider changing posts table's userid to username for it is unique as well
                // consider distinguishing between images and videos when stored
                foreach($posts as $post) {
                    array_push($_SESSION['postIds'], $post['id']);
                    $username = DB::query("SELECT `username` FROM `users` WHERE `id`='".$post['userID']."'")->fetch_assoc()['username'];
                    echo "<div class='post'>
                    <div class='leftPostSide'>
                        <span class='postOwner'>
                            Posted by *<a href=profile.php?user=$username>".$username."</a>"." @ ".$post['date'].
                        "</span><br>
                        <p class='content'>".htmlspecialchars($post['content'])."</p>
                    </div>
                    <div class='media'>";
                    if(isImage($post['fileUploaded']))
                        echo "<image src='uploads/".$post['fileUploaded']."' alt='posted image'>";
                    else
                        echo "<video src='uploads/".$post['fileUploaded']."' alt='posted video' controls></video>";
                    echo "</div>
                    <br/>
                    <div class='postFooter'>
                        Total stars: <span class='stars'>".$post['totalStars']."</span> |";
                        $userid = DB::query("SELECT `id` FROM `users` WHERE `username`='".$_SESSION['username']."'")->fetch_assoc()['id'];
                        $stars = DB::query("SELECT `stars` FROM `postsstars` WHERE `userID`='".$userid."' AND `postID`='".$post['id']."'")->fetch_assoc()['stars'];
                        for ($i=0; $i < $stars; $i++)
                            echo "<img alt='star' src='/iconList/FilledStar.png' class='star'>";
                        for ($i=$stars; $i < 5; $i++)
                            echo "<img alt='star' src='/iconList/RateStar.svg' class='star'>";
                    echo "</div>
                    </div>";
                }
                
                function isImage($fileName) {
                    return array_search(pathinfo($fileName, PATHINFO_EXTENSION), array("jpeg", "jpg", "png"));
                }
            ?>
        </div>
    </main>
    <script src="scripts/homepage.js"></script>
    <script src="scripts/sidenav.js"></script>
</body>

</html>