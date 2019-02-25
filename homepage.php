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
    <link rel="stylesheet" href="styles/homepage.css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">

    <title>Homepage Twinkle</title>
</head>

<body>
<header>
    <nav id="navi">
        <ul>
        <span id="sidenavbutton" onclick="openNav()">&#9776;</span>
            <li><a href="#"><img alt="user" src="/iconList/userwhite.png" class="usericon"></a></li>
            <li><a href="#"><img alt="notifications" src="/iconList/FilledStar.png" class="notifi"></a></li>
            <li><a href="#"><img alt="note" src="/iconList/notewhite.png" class="note"></a></li>
            <input name="searchbar" type="search" placeholder="Popularities..." id="searchBar"/>
        </ul>
        <span><a href="homepage.php" id="logo">Twinkle</a></span>
    </nav>
    <div id="filtering">
        <ul class="filterlist">
            <li><a href="#" class="link">HOME</a></li>
            <li><a href="#" class="link">HUMOR</a></li>
            <li><a href="#" class="link">ART</a></li>
            <li><a href="#" class="link">SPORT</a></li>
            <li><a href="#" class="link">TECH</a></li>
            <li><a href="#" class="link">FOOD</a></li>
            <li><a href="#" class="link">NATURE</a></li>
            <li id="adding"><a href="#" class="plus link">+</a></li>
        </ul>
        <span class="bord"></span>
    </div>
</header>

    <?php
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
                $posts = DB::query("SELECT `userID`, `date`, `content`, `fileUploaded`, `totalStars` FROM `posts` ORDER BY `date` DESC");
                // consider changing posts table's userid to username for it is unique as well
                // consider distinguishing between images and videos when stored
                foreach($posts as $post) {
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
                    <div class='footer'>
                        Total stars: ".$post['totalStars']." |
                        <img alt='star' src='/iconList/RateStar.svg' class='star'>
                        <img alt='star' src='/iconList/RateStar.svg' class='star'>
                        <img alt='star' src='/iconList/RateStar.svg' class='star'>
                        <img alt='star' src='/iconList/RateStar.svg' class='star'>
                        <img alt='star' src='/iconList/RateStar.svg' class='star'>
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
    <script src="scripts/sidenav.js"></script>
    <script>
        function getChildNum(element) {
    var siblings = element.parentElement.children;
    for(var i = 0; i < siblings.length; i++)
        if(siblings[i] === element)
            return i;
    return -1;
}


function rate(e) {
    if (e.target.matches("img")) {
        var childNum = getChildNum(e.target),
            siblings = e.target.parentElement.children,
            xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        if(siblings[childNum].src.indexOf("Fulledstar.png") !== -1 && (!siblings[childNum + 1] || siblings[childNum + 1].src.indexOf("Firststar.png") !== -1)) { // pressed again on same star - cancel
            formData.append("stars", 0);
            for(var i = 0; i < 5; i++) 
                siblings[i].src = "/Firststar.png";
        } else {
            var i = 0;
            for(; i <= childNum; i++)
                siblings[i].src = "/Fulledstar.png";
            for(; i < 5; i++)
                siblings[i].src = "/Firststar.png";
            formData.append("stars", i + 1);
        }
        // xmlhttp.open("POST", "templates/uploadPost.php", true);
        // xmlhttp.send(formData);
    }
}
    </script>
</body>

</html>