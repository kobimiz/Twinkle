<?php
    session_start();
    require_once("templates/connection.php");
    require_once("templates/functions.php");

    if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
        $username = htmlspecialchars($_SESSION['username']);
        $password = htmlspecialchars($_SESSION['password']);
        if(!login($username, $password))
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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <title>Homepage Twinkle</title>
</head>

<body>
    <?php include_once("templates/header.php"); ?>

<div id="sidenavcover">
        <div id="mySidenav" class="sidenavcont">
                <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&#10095;</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Clients</a>
                <a href="#"><img src="/iconList/cog-solid.svg"></a>
                <a href="#" id="logout"><img src="/iconList/sign-out-alt-solid.svg"></a>

        </div>
</div>

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
                $query = "SELECT `userID`, `date`, `content`, `fileUploaded`, `totalStars` FROM `posts` ORDER BY `date` DESC";
                $posts = mysqli_query($connection, $query);
                // consider changing posts table's userid to username for it is unique as well
                // consider distinguishing between images and videos when stored
                foreach($posts as $post) {
                    $username = mysqli_fetch_assoc(mysqli_query($connection, "SELECT `username` FROM `users` WHERE `id`='".$post['userID']."'"))['username'];
                    echo "<div class='post'>
                    <span class='postOwner'>Posted by *
                    <a href=profile.php?user=$username>".$username."</a>".
                    " @ ".$post['date'].
                    "</span>
                    <div class='content'>";
                    if(isImage($post['fileUploaded']))
                        echo "<image src='uploads/".$post['fileUploaded']."' alt='posted image'>";
                    else
                        echo "<video src='uploads/".$post['fileUploaded']."' alt='posted video'>";
                    echo "<br/>".$post['content']."</div>
                    <br/>
                    <div class='options'>
                    </div>
                    </div>";
                }
                
                function isImage($fileName) {
                    return array_search(pathinfo($fileName, PATHINFO_EXTENSION), array("jpeg", "jpg", "png"));
                }
            ?>
        </div>
    </main>
    <script src="scripts/homepage.js"></script>
    <script>
var sidenavcover = document.getElementById("sidenavcover");
 window.onclick = function(event) {
  if (event.target == sidenavcover) {
        sidenavcover.style.display = "none";
  }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "100px";
  document.getElementById("sidenavcover").style.display = "block";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("sidenavcover").style.display = "none";
}
</script>
</body>

</html>