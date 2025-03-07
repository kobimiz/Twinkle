"use strict";
var filePreview = document.getElementById("filePreview"),
    errorMessage = document.getElementById("errorMessage"),
    fileInput = document.getElementById("fileUpload"),
    progress = document.getElementById("progress"),
    filterlist = document.querySelector('.filterlist'),
    addplus = document.getElementById('adding'),
    bar = document.getElementById("bar");
var acceptetFileTypes = ["jpeg", "jpg", "png", "gif", "avi", "amv", "mp4", "mkv"], // consider adding more supported file types. consider rethinking
    videosFileTypes = ["avi", "amv", "mp4", "mkv"];
var prevYScroll = window.pageYOffset;
var searchIcon = document.querySelector(".searchIcon");
var sidenavbutton = document.getElementById("sidenavbutton");
var searchInp = document.getElementById("searchBar");
var displayDis = document.querySelectorAll("#navi>ul>li");
var textarea = document.querySelector("textarea");

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
if(window.innerWidth >= 651){
    window.addEventListener("scroll", function(){
        var currentYScroll = window.pageYOffset;
    
        if(prevYScroll < currentYScroll){
            document.getElementById("navi").style.padding = "5px 40px";
            document.getElementById("filtering").style.top = "45px";
            document.getElementById("navi").style.height = "45px";
            document.querySelector(".usericon").style.visibility = "hidden";
            document.querySelector(".usericon").style.opacity = "0";
            document.querySelector(".notifi").style.visibility = "hidden";
            document.querySelector(".notifi").style.opacity = "0";
            document.querySelector(".navnote").style.visibility = "hidden";
            document.querySelector(".navnote").style.opacity = "0";
            document.querySelector("#sidenavbutton").style.fontSize = "27px";
            document.querySelector(".Logofont").style.display = "none";
            document.querySelector(".imgfont").style.marginRight = "110px";
        }else{
            document.getElementById("navi").style.padding = "10px 40px";
            document.getElementById("filtering").style.top = "60px";
            document.getElementById("navi").style.height = "60px";
            document.querySelector(".usericon").style.visibility = "visible";
            document.querySelector(".usericon").style.opacity = "1";
            document.querySelector(".notifi").style.visibility = "visible";
            document.querySelector(".notifi").style.opacity = "1";
            document.querySelector(".navnote").style.visibility = "visible";
            document.querySelector(".navnote").style.opacity = "1";
            document.querySelector("#sidenavbutton").style.fontSize = "30px";
            document.querySelector(".Logofont").style.display = "";
            document.querySelector(".imgfont").style.marginRight = "0";
        }
    
        prevYScroll = currentYScroll;
    });
}

searchIcon.addEventListener("touchstart", function(){
    // var Inplength = window.innerWidth - searchIcon.width - sidenavbutton.clientWidth + "px";

    if(displayDis[1].style.display == ""){
        for(var i=1; i < displayDis.length; ++i){
            displayDis[i].setAttribute("style", "display: none;");
        }
        // searchInp.setAttribute("style", "display: block; max-width: 350px;");
        searchInp.style.display = "block";
        searchInp.style.maxWidth = "35px"
        setTimeout(function(){searchInp.style.maxWidth = "350px", 100});
        document.querySelector("#navi>ul").setAttribute("style", "display: inline-flex");
    }else{
        for(var i=0; i < displayDis.length; ++i){
            displayDis[i].removeAttribute("style");
        }
        searchInp.setAttribute("style", "display: none;");
        document.querySelector("#navi>ul").setAttribute("style", "display: flex;");
        searchInp.setAttribute("style", "max-width: 350px");
    }
});


// todo: fix bug when uploading two of more posts and commenting and replying (order)
fileInput.addEventListener("change", function (e) { // todo: add remove file upload, fix bug
    if(this.files.length > 0) {
        var fileExtension = this.files[0].name.split('.').pop().toLowerCase();
        if (acceptetFileTypes.indexOf(fileExtension) !== -1) {
            errorMessage.style.visibility = "hidden";
            document.querySelector(".imageshow").style.display = "block";
            closeImg.style.display = 'inline';
            filePreview.style.display = "inline";
            reader.readAsDataURL(this.files[0]);
        }
        else {
            errorMessage.style.visibility = "visible";
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

document.querySelector(".declareBtn").addEventListener("click", function() {
    if(fileInput.files.length > 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                // consider the case where a document is returned from this.responseText
                if(this.responseText === "error") {
                    errorMessage.style.visibility = "visible";
                    errorMessage.innerHTML = "An unknown error has occured. Please try again, or contact us if the problem presists.";
                } else if(this.responseText === "invalid type") {
                    errorMessage.style.visibility = "visible";
                    errorMessage.innerHTML = "File format is not supported. <a href='helpCenter/fileUploadingQA.php'>For further information please click here.</a>";
                } else if(this.responseText === "too big") {
                    errorMessage.style.visibility = "visible";
                    errorMessage.innerHTML = "The uploaded file is too large. <a href='helpCenter/fileUploadingQA.php#largeFile'>For further information, please click here.</a>";
                } else {
                    var posts = document.getElementById("posts");
                    errorMessage.style.visibility = "hidden";
                    
                    if(posts.firstElementChild.getElementsByTagName("video").length === 1) // was post of video
                        Video.videos.unshift(new Video(posts.querySelector(".Vcon"))); // selects the first

                    for (var i = 0; i < Post.posts.length; ++i) // shift other posts indices by 1
                        Post.posts[i].index += 1;

                    var post = JSON.parse(this.responseText);
                    var postDOM = new PostDOM(post.properties, post.comments);
                    posts.insertAdjacentElement("afterbegin", postDOM.postCon);
                    Post.posts.unshift(new Post(postDOM.postCon, 0));
                }
            }
        };
        // same loading effects as "reader"-'s
        xmlhttp.onloadstart = reader.onloadstart;
        xmlhttp.onloadend = reader.onloadend;
        xmlhttp.onprogress = reader.onprogress;
    
        var formData = new FormData();
        formData.append("file", fileInput.files[0], fileInput.files[0].name); // todo: check how php knows the file (might cause a problem once we go live)
        
        formData.append("content", textarea.value);
        xmlhttp.open("POST", "templates/uploadPost.php", true);
        xmlhttp.send(formData);
        filePreview.src = "";
        filePreview.style.display = "none";
        textarea.value = "";

        // hide modal
        modal.style.display = "none";
        document.getElementsByTagName("main")[0].classList.remove("set-blur");
        closeImg.style.display = 'none';
    } else {
        errorMessage.style.visibility = "visible";
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
window.addEventListener("scroll",function(){
    bord.style.transition = "none";
    const firstlink = links[0].getBoundingClientRect();
    bord.style.top = `${firstlink.top}px`;
    bord.style.transition = "all 0.4s";
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

document.querySelector('#closeImg').addEventListener("click", function() {
    closeImg.style.display = 'none';
    fileInput.value = "";
    filePreview.style.display = "none";
    document.querySelector(".imageshow").style.display = "none";
});