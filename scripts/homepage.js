"use strict";
var filePreview = document.getElementById("filePreview"),
    errorMessage = document.getElementById("errorMessage"),
    fileInput = document.getElementById("fileUpload"),
    progress = document.getElementById("progress"),
    filterlist = document.querySelector('.filterlist'),
    addplus = document.getElementById('adding'),
    bar = document.getElementById("bar");
var acceptetFileTypes = ["jpeg", "jpg", "png", "gif", "avi", "amv", "mp4"], // consider adding more supported file types. consider rethinking
    videosFileTypes = ["avi", "amv", "mp4"];

// todo: think of ways to compress files
// todo: asynchronous image loading
var reader = new FileReader();
reader.onload = function (e) { // only on successful loading
    filePreview.src = e.target.result;
};
reader.onloadstart = function() {
    progress.style.visibility = "visible";
};
reader.onloadend = function() { // on load completion regardless to success
    progress.style.visibility = "hidden";
}
reader.onprogress = function(e) {
    if (e.lengthComputable){
        var percentage = Math.round((e.loaded/e.total)*100);
        bar.style.width = percentage + "%";
        bar.textContent = percentage+'%';
    }
};

fileInput.addEventListener("change", function (e) { // todo: add remove file upload, fix bug
    if(this.files.length > 0) {
        var fileExtension = this.files[0].name.split('.').pop().toLowerCase();
        if (acceptetFileTypes.indexOf(fileExtension) !== -1) {
            errorMessage.style.display = "none";
            filePreview.style.display = "inline";
            reader.readAsDataURL(this.files[0]);
        }
        else {
            errorMessage.style.display = "inline";
            errorMessage.innerHTML = "File format is not supported. <a href='helpCenter/fileUploadingQA.php'>For further information please click here.</a>";
            filePreview.style.display = "none";
            filePreview.src = "";
        }
    }
    else {
        filePreview.style.display = "none";
        filePreview.src = "";
    }
});

document.getElementById("post").addEventListener("click", function() {
    if(fileInput.files.length > 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                var res = this.responseText.split(","); // [status,username,fileName,content,profilePic]
                // consider the case where a document is returned from this.responseText
                if(res[0] === "success") {
                    var media,
                        posts = document.getElementById("posts");
                    errorMessage.style.display = "none";
                    if(videosFileTypes.indexOf(res[2].substring(res[2].indexOf(".") + 1,res[2].length)) === -1) // file extention is an image's
                        media = "<img src='uploads/" + res[2] + "' alt='posted image'>";
                    else {
                        media = "<div class='topbar' style='top: -40px;'>\
                                    <div class='juicecon'>\
                                        <div class='TimeCount'> <span class='curtime'>0:00</span> <span>/</span> <span class='durtime'></span></div>\
                                        <div class='linediv'>\
                                            <div class='juicebar' style='width: 0.0618326%;'></div>\
                                            <div class='juicemark'></div>\
                                            <div class='videojump'></div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <video class='video' src='uploads/" + res[2] + "' alt='Posted video'>Your browser do not support videos. You may want to consider upgrading it.</video>\
                                <div class='playanime'></div>\
                                <div class='pauseanime'></div>\
                                <div class='bottombar' style='bottom: -40px;'>\
                                    <div class='left'>❮</div>\
                                    <div class='extracon'>\
                                        <div class='volume'> <img alt='volume' src='/iconList/Volumeoff.png' class='volumeicon'> </div>\
                                    </div>\
                                    <div class='control'>\
                                        <button class='play-pause'></button>\
                                    </div>\
                                    <div class='right'>❯</div>\
                                </div>";
                    }
                    posts.insertAdjacentHTML("afterbegin",
                        "<div class='postcon'>\
                            <div class='contentcon'>\
                                <div class='topdata'>\
                                    <span class='fas fa-star avgstar'></span>\
                                    <span class='avgstardata'>0</span>\
                                    <span class='optionicon'><img alt='options' src='/iconList/ArrowDown.png' style='width:22px; height:15px;' class='more'></span>\
                                    <div class='topoptions'>\
                                        <div class='optionscon'>\
                                            <ul>\
                                                <li><a href='#'>Report</a></li>\
                                                <li><a href='#'>Feed back</a></li>\
                                            </ul>\
                                        </div>\
                                    </div>\
                                </div>\
                                \
                                <div class='Vcon'>" + media + "</div>\
                                \
                                <div class='bottomdata'>\
                                    <div class='starrate'>\
                                        Total stars: <span class='stars'>0</span> |<img alt='star' src='/iconList/RateStar.svg' class='star'><img alt='star' src='/iconList/RateStar.svg' class='star'><img alt='star' src='/iconList/RateStar.svg' class='star'><img alt='star' src='/iconList/RateStar.svg' class='star'><img alt='star' src='/iconList/RateStar.svg' class='star'></div>\
                                    <div class='Avgdata'>\
                                        <img alt='Users Amount' src='/iconList/User.png' class='UserAm'>\
                                        <span class='usernum'>0</span>\
                                    </div>\
                                </div>\
                                \
                                <div class='contentData'>\
                                    <div class='postowner'>\
                                        <img alt='User profile photo' src='" + res[4] + "' class='ownerphoto'>\
                                        <a class='ownerfullname' href='profile.php?user=" + res[1] + "'>" + res[1] + "</a>\
                                    </div>\
                                \
                                    <div class='date'>" + getDate() + "</div>\
                                </div>\
                                \
                                <div class='descript'>" + res[3] + "</div>\
                                \
                                <div class='acts'>\
                                    <div class='act1'>\
                                        <a>\
                                            <span>Comment</span>\
                                            <img alt='comment' src='/iconList/comment.png' class='comment' style='width:40px; height:30px;'>\
                                        </a>\
                                    </div>\
                                    <div class='act2'>\
                                            <a>\
                                                <span>Note</span>\
                                                <img alt='Note Button' src='/iconList/note.png' class='note' style='width:30px; height:30px;'>\
                                            </a>\
                                    </div>\
                                    <div class='act3'>\
                                        <a href='#'>\
                                            <span>Share</span>\
                                            <img alt='Share a post' src='/iconList/share.png' style='width:30px; height:30px;'>\
                                        </a>\
                                    </div>\
                                </div>\
                                \
                                <div class='comform'>\
                                    <input name='typecom' type='text' placeholder='Share your thoughts..' autocomplete='off'>\
                                    <button class='submit'>&gt;</button>\
                                </div>\
                                <div class='comments'></div>\
                            </div>\
                        </div>");
                    if(videosFileTypes.indexOf(res[2].substring(res[2].indexOf(".") + 1,res[2].length)) !== -1) // file extention is a video's. consider rethinking because this check is being made twice
                        Video.videos.unshift(new Video(posts.querySelector(".Vcon"))); // selects the first
                    Post.posts.unshift(new Post(posts.querySelector(".postcon"))); // same
                }
                else if(res[0] === "error") {
                    errorMessage.style.display = "inline";
                    errorMessage.innerHTML = "An unknown error has occured. Please try again, or contact us if the problem presists.";
                } else if(res[0] === "invalid type") {
                    errorMessage.style.display = "inline";
                    errorMessage.innerHTML = "File format is not supported. <a href='helpCenter/fileUploadingQA.php'>For further information please click here.</a>";
                } else { // file too big
                    errorMessage.style.display = "inline";
                    errorMessage.innerHTML = "The uploaded file is too large. <a href='helpCenter/fileUploadingQA.php#largeFile'>For further information, please click here.</a>";
                }
            }
        };
        // same loading effects as "reader"-'s
        xmlhttp.onloadstart = reader.onloadstart;
        xmlhttp.onloadend = reader.onloadend;
        xmlhttp.onprogress = reader.onprogress;
    
        var formData = new FormData(),
            textarea = document.getElementsByTagName("textarea")[0];
        formData.append("file", fileInput.files[0], fileInput.files[0].name); // todo: check how php knows the file (might cause a problem once we go live)
        formData.append("content", textarea.value);
        xmlhttp.open("POST", "templates/uploadPost.php", true);
        xmlhttp.send(formData);
        filePreview.src = "";
        filePreview.style.display = "none";
        textarea.value = "";
    } else {
        errorMessage.style.display = "inline";
        errorMessage.innerHTML = "No image/video? Shall we share as a note instead?";
    }
});

const links = document.querySelectorAll(".link");
const bord = document.querySelector(".bord");
bord.classList.add("bord");

function bordlink(){
    const linkcoords = this.getBoundingClientRect();
    bord.style.left =  `${linkcoords.left - window.scrollX}px`;
    bord.style.width =  `${linkcoords.width}px`;
}

links.forEach(a => a.addEventListener("click", bordlink));
window.addEventListener("load", function(){
    const firstlink = links[0].getBoundingClientRect();
    bord.style.left = `${firstlink.left}px`;
    bord.style.top = `${firstlink.top}px`;
    bord.style.width = `${firstlink.width}px`;
    bord.style.height = `${firstlink.height}px`;
});

addplus.addEventListener("click",function(){
    var child = document.createElement("li");
    var childtwo = document.createElement("input");
    childtwo.className = "addedinp";
    childtwo.setAttribute('maxlength','20');
    child.appendChild(childtwo);
    filterlist.insertBefore(child, addplus);
    childtwo.focus();
    childtwo.addEventListener("focusout", addCategory);
    childtwo.addEventListener("keyup", function(e){
        if(e.keyCode === 13) {
            if(childtwo.value.trim() !== ""){
                var filter = document.createElement('a');
                filter.className = "link";
                filter.setAttribute("href", "#");
                var txtnode = document.createTextNode(childtwo.value);
                filter.appendChild(txtnode);
                child.appendChild(filter);
                var linkcoords = child.getBoundingClientRect();
                bord.style.width =  `${linkcoords.width}px`;
                childtwo.removeEventListener("focusout", addCategory);
                childtwo.focusout = undefined;
                childtwo.remove();
                filter.addEventListener("click", bordlink);
            } else
                alert("please fill up");
        } else if(e.key === "esc"){
            child.remove();
            childtwo.remove();
        }
    });
});

function addCategory() {
    if(this.value === "")
        this.dispatchEvent(new KeyboardEvent("keyup", { key:"esc" }));
    else
        this.dispatchEvent(new KeyboardEvent("keyup", { keyCode:13 }));
}