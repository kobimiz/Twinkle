<?php
    require_once("classes/queries.php");
    DB::connect();

    if(!DB::isLoggedIn())
    header("Location: signin.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="styles/Friendspage.css" type="text/css"/>
    <link rel="stylesheet" href="styles/headerD.css" media="screen and (min-width: 650px)" type="text/css">
    <link rel="stylesheet" href="styles/headerM.css" media="screen and (max-width: 650px)" type="text/css">
    <link rel="stylesheet" href="styles/sidenav.css">
    <link rel="icon" href="/iconList/TwinkleCon.png" type="image/png">
    <title>Twinkle - Yehuda's Friends list</title>
</head>
<body>
<?php
    include_once("templates/header.php");
    include_once("templates/sidenav.php");
?>
<div class="Friendspoper">
    <div class="headline">
        <div class="settings_filters">
            <img src="iconList/SettingsWhite.png" alt="Filters">
        </div>
        <h2>Yehuda's FRIENDS</h2>
    </div>
    <div class="list_con">
        <ul>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
            <li>
                <div class="friends_line-img">
                    <img src="../iconList/image.jpg" alt="User Image">
                </div>
                <div class="friends_line-info">
                    <div class="friends_line-left">
                        <div class="friends_name">
                            <span>
                                Yehuda Daniel
                            </span>
                        </div>
                        <div class="friends_total">
                            <img src="../iconList/FilledStar.png" alt="Star" style="width:15px; height:15px">
                            <span>20,111</span>
                        </div>
                    </div>
                    <div class="friends_line-right">
                        <img src="../iconList/newFriend.png" alt="Friend">
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>
<script src="scripts/sidenav.js"></script>
<script src="scripts/header.js"></script>
</body>
</html>

<!--TODO: set the icon of the "add  friend/remove friend" accordingly-->