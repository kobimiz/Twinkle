<?php
    require_once("classes/queries.php");
    DB::connect();

    $sql = "SELECT `userID` from `postsstars` where `postID` = 60 and `stars` = 5";
?>

<div class="Viewer">
    <div class="poper">
        <div class="topFilt">
            <span class="Backarrow">&larr;</span>
            <span class="mainSpan">Rate</span>
        </div>
        <div class="strlist">
            <ul>
                <li class="gage">
                    <img src="/../iconList/str5.png" alt="stars">
                    <div><span class="count">53</span></div>
                </li>
                <li class="gage">
                    <img src="/../iconList/str4.png" alt="stars">
                    <div><span class="count">53</span></div>
                </li>
                <li class="gage">
                    <img src="/../iconList/str3.png" alt="stars">
                    <div><span class="count">53</span></div>
                </li>
                <li class="gage">
                    <img src="/../iconList/str2.png" alt="stars">
                    <div><span class="count">53</span></div>
                </li>
                <li class="gage">
                    <img src="/../iconList/str1.png" alt="stars">
                    <div><span class="count">53</span></div>
                </li>
            </ul>
        </div>
        <div class="strlistAnim">
            <ul>
                <li class="Load">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <div>
                        <div class="loadbar"></div>
                        <span class="count">53</span>
                    </div>
                </li>
                <li class="Load">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <div>
                        <div class="loadbar"></div>
                        <span class="count">53</span>
                    </div>
                </li>
                <li class="Load">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <div>
                        <div class="loadbar"></div>
                        <span class="count">53</span>
                    </div>
                </li>
                <li class="Load">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <div>
                        <div class="loadbar"></div>
                        <span class="count">53</span>
                    </div>
                </li>
                <li class="Load">
                    <img src="/../iconList/FilledStar.png" alt="stars">
                    <div>
                        <div class="loadbar"></div>
                        <span class="count">53</span>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</div>