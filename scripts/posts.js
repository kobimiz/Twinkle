var video = document.querySelector(".video");
var btn = document.querySelector(".play-pause");
var leftBtn = document.querySelector(".left");
var rightBtn = document.querySelector(".right");
var juiceBar = document.querySelector(".juicebar");
var juiceMark = document.querySelector(".juicemark");
var videojump = document.querySelector('.videojump');
var linediv = document.querySelector(".linediv");
var durTIme = document.querySelector(".durtime");
var curTIme = document.querySelector(".curtime");
var playanime = document.querySelector(".playanime");
var pauseanime = document.querySelector(".pauseanime");
var topbar = document.querySelector(".topbar");
var bottombar = document.querySelector(".bottombar");
var optionsarrows = document.querySelectorAll(".optionicon");
var optionscons = document.querySelectorAll(".optionscon");
var screensize = document.querySelector(".screenicon");
var volume = document.querySelector(".volumeicon");
var volumecheck = false;
var activatedArrowDownIndex = -1;
var comforms = document.querySelectorAll('.comform');
var activatedCommentIndex = -1;
var activatedRepIndex = -1;
var acts1 = document.querySelectorAll('.act1');
var replies = document.querySelectorAll(".comreply");
var repforms = document.querySelectorAll(".replyform");
var submitReplyCommentButtons = document.querySelectorAll(".submit");

function FPP() {
    if (video.paused) {
        btn.classList.add("pause");
        btn.classList.remove("play");
        video.play();
    } else {
        btn.classList.add("play");
        btn.classList.remove("pause");
        video.pause();
    }
}

btn.onclick = FPP;
video.onclick = function () {
    if (video.paused) {
        btn.classList.add("pause");
        btn.classList.remove("play");
        video.play();
    } else {
        btn.classList.add("play");
        btn.classList.remove("pause");
        video.pause();
    }
}
video.ontimeupdate = function () {
    if (video.ended) {
        btn.classList.add("play");
    }
}
leftBtn.onclick = function () {
    video.currentTime += -5;
}
rightBtn.onclick = function () {
    video.currentTime += +5;
}

video.addEventListener("timeupdate", function () {
    var juicePos = video.currentTime / video.duration;
    juiceBar.style.width = juicePos * 100 + "%";
});

// What the fuck is this & and 3 mousemove event listeners??? check this asap
function scrub(event) {
    var scrubTime = (event.offsetX / videojump.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

var mousedown = false;
videojump.addEventListener("click", scrub);
videojump.addEventListener("mousemove", (e) => mousedown && scrub(e));
videojump.addEventListener("mousemove", (e) => mousedown = true);
videojump.addEventListener("mousemove", (e) => mousedown = false);

video.addEventListener("mouseenter", function () {

});

var closeBars;
function manageBars() {
    clearTimeout(closeBars);
    bottombar.style.bottom = "0px";
    topbar.style.top = "0px";
    closeBars = setTimeout(function() {
        bottombar.style.bottom = "-40px";
        topbar.style.top = "-40px";
    }, 2000);
}
function hideBars() {
    bottombar.style.bottom = "-40px";
    topbar.style.top = "-40px";
}

video.addEventListener("mousemove", manageBars);
bottombar.addEventListener("mousemove", manageBars);
topbar.addEventListener("mousemove", manageBars);

video.addEventListener("mouseleave", hideBars);
bottombar.addEventListener("mouseleave", hideBars);
topbar.addEventListener("mouseleave", hideBars);

/* sliding the juiceBar and changing currentTime position */
var isDown = false;
var startX;
var scrolLeft;
var pausedBeforeJump = true;

videojump.addEventListener("mousedown", function (e) {
    isDown = true;
    startX = e.pageX - videojump.offsetLeft;
    scrolLeft = videojump.scrollLeft;
    if (video.paused)
        pausedBeforeJump = true;
    else {
        pausedBeforeJump = false;
        video.pause();
    }
    btn.classList.add("play");
    btn.classList.remove("pause");
});

videojump.addEventListener("mouseleave", function () {
    isDown = false;
});

videojump.addEventListener("mouseup", function () {
    isDown = false;
    if (video.paused && !pausedBeforeJump) {
        btn.classList.add("pause");
        btn.classList.remove("play");
        video.play();
    } else{
        btn.classList.add("play");
        btn.classList.remove("pause");
    }
});

videojump.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();
    const pos = e.pageX - videojump.offsetLeft; // mouse position on X axis
    const run = pos - startX; // mouse distance from starting point
    juiceBar.style.width = juiceBar.offsetWidth + (e.offsetX - juiceBar.offsetWidth) + "px";
    video.currentTime = (e.offsetX / videojump.offsetWidth) * video.duration;
});

// red line lenght plus mouse distance


video.addEventListener("timeupdate", displaytime, false);

function displaytime() {
    var curmins = Math.floor(video.currentTime / 60);
    var cursecs = Math.round(video.currentTime - curmins * 60);
    var durmins = Math.floor(video.duration / 60);
    var dursecs = Math.round(video.duration - durmins * 60);
    if (cursecs < 10) {
        cursecs = "0" + cursecs;
    }
    if (dursecs < 10) {
        dursecs = "0" + dursecs;
    }
    curTIme.innerHTML = curmins + ":" + cursecs;
    durTIme.innerHTML = durmins + ":" + dursecs;

}

volume.addEventListener("click",function(){
    if(!volumecheck){
        volume.src = "/iconList/Volumeon.png";
        volume.style.width = "22px";
        volume.style.height = "20px";
        video.muted = true;
        volumecheck = true;

    }else{
        volume.src = "/iconList/Volumeoff.png";
        volume.style.width = "30px";
        volume.style.height = "35px";
        video.muted = false;
        volumecheck = false;
    }
});

/*<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>*/
//<<<<<<<>>>>>>>>
// consider setting already existing functions to timeOut for there would be multiple videos
video.addEventListener("click", function () {
    if (video.paused) {
        pauseanime.classList.add("pauseanimeadd");
        setTimeout(function() { pauseanime.classList.remove("pauseanimeadd"); }, 1000);
    } else if (video.play) {
        playanime.classList.add("playanimeadd");
        setTimeout(function() { playanime.classList.remove("playanimeadd"); }, 1000);
    }
});

/*<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>*/

document.body.addEventListener('click',function(){
    if(activatedArrowDownIndex !== -1){
        optionscons[activatedArrowDownIndex].style.display = "none";
        activatedArrowDownIndex = -1
    }
});

document.body.addEventListener('click', function(){
    if(activatedCommentIndex !== -1) {
        comforms[activatedCommentIndex].style.display = "none";
        activatedCommentIndex = -1;
    }
});
/*stars animation --------------------- */

var starsContainer = document.getElementsByClassName("starrate");

function getChildIndex(element) {
    var siblings = element.parentElement.children;
    for (var i = 0; i < siblings.length; i++)
        if (siblings[i] === element)
            return i;
    return -1;
}
function rate(e) {
    if (e.target.matches("img")) {
        var starRate = getChildIndex(e.target), // since there is a span element in e.target.parentElement, its child index is equal its star rate
            siblings = e.target.parentElement.children,
            xmlhttp = new XMLHttpRequest(),
            formData = new FormData(),
            postIndex = getChildIndex(this.parentElement.parentElement.parentElement);
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var stats = this.responseText.split("\n");
                document.getElementsByClassName("avgstardata")[postIndex].textContent = stats[0];
                document.getElementsByClassName("stars")[postIndex].textContent = stats[1];
            }
        }
        formData.append("postIndex", postIndex);
        if (siblings[starRate].src.indexOf("FilledStar.png") !== -1 && (!siblings[starRate + 1] || siblings[starRate + 1].src.indexOf("RateStar.svg") !== -1)) { // pressed again on same star - cancel
            formData.append("starRating", 0);
            for (var i = 1; i < 6; i++)
                siblings[i].src = "/iconList/RateStar.svg";
        } else {
            for (var i = 1; i <= starRate; i++)
                siblings[i].src = "/iconList/FilledStar.png";
            for (var i = starRate + 1; i < 6; i++)
                siblings[i].src = "/iconList/RateStar.svg";
            formData.append("starRating", starRate);
        }
        xmlhttp.open("POST", "templates/rate.php", true);
        xmlhttp.send(formData);
    }
}

function stopPropagation(e) { e.stopPropagation(); }

for(var i = 0; i < starsContainer.length; i++) {
    starsContainer[i].addEventListener("click", rate);
    comforms[i].addEventListener("click", stopPropagation);
    optionscons[i].addEventListener("click", stopPropagation);

    acts1[i].addEventListener("click", (function() {
        var index = i; // closure
        return function(e){
            if(index !== activatedCommentIndex){ // current comment not displayed
                if(activatedCommentIndex !== -1)// hide last comment
                    comforms[activatedCommentIndex].style.display = "none";
                comforms[index].style.display = "block"; // display current comment
                activatedCommentIndex = index;
                e.stopPropagation();
            } else { // current comment already displayed
                comforms[index].style.display = "none";
                activatedCommentIndex = -1;
            }
        }
    })());

    // show and hide of the options nav bar
    optionsarrows[i].addEventListener("click", (function() {
        var index = i; // closure
        return function(e){
            if(index !== activatedArrowDownIndex) { // current arrow not displayed
                if(activatedArrowDownIndex !== -1) // hide last arrow
                    optionscons[activatedArrowDownIndex].style.display = "none";
                optionscons[index].style.display = "block"; // display current arrow
                activatedArrowDownIndex = index;
                e.stopPropagation();
            } else { // current arrow already displayed
                optionscons[index].style.display = "none";
                activatedArrowDownIndex = -1;
            }
        }
    })());
}

//change the size of the video screen

// screensize.addEventListener("click", openFullscreen);
// function openFullscreen() {
//   if (screensize.requestFullscreen) {
//     video.requestFullscreen();
//   } else if (screensize.mozRequestFullScreen) { /* Firefox */
//     video.mozRequestFullScreen();
//   } else if (screensize.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//     video.webkitRequestFullscreen();
//   } else if (screensize.msRequestFullscreen) { /* IE/Edge */
//     video.msRequestFullscreen();
//   }
// }
//comment click anime

// consider adding onerror to all ajaxes
// add loading post/comment/reply after ajax is done
function submitReply(e) {
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest();
        // Loading effect
        xmlhttp.onloadstart = reader.onloadstart;
        xmlhttp.onloadend = reader.onloadend;
        xmlhttp.onprogress = reader.onprogress;

        var formData = new FormData();
        formData.append("content", val);
        formData.append("commentIndex", getChildIndex(e.target.parentElement.parentElement) - 1);
        formData.append("postIndex", getChildIndex(e.target.parentElement.parentElement.parentElement.parentElement.parentElement));
        xmlhttp.open("POST", "templates/reply.php", true);
        xmlhttp.send(formData);
    } else {
        // .....
    }
}

function submitComment(e) {
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest();
        // Loading effect
        xmlhttp.onloadstart = reader.onloadstart;
        xmlhttp.onloadend = reader.onloadend;
        xmlhttp.onprogress = reader.onprogress;

        var formData = new FormData();
        formData.append("content", val);
        formData.append("postIndex", getChildIndex(e.target.parentElement.parentElement.parentElement));
        xmlhttp.open("POST", "templates/comment.php", true);
        xmlhttp.send(formData);
    } else {
        // .....
    }
}

//reply click anime
// consider making a common function for that closure trick function
for (let i = 0; i < replies.length; i++) {
    replies[i].addEventListener("click", (function() {
        var index = i;
        return function(e){
            if(index !== activatedRepIndex){ // current reply not displayed
                if(activatedRepIndex !== -1)// hide last reply
                    repforms[activatedRepIndex].style.display = "none";
                repforms[index].style.display = "block"; // display reply comment
                activatedRepIndex = index;
                e.stopPropagation();
            } else { // current reply already displayed
                repforms[index].style.display = "none";
                activatedRepIndex = -1;
            }
        }
    })());
    repforms[i].addEventListener("click", stopPropagation);
}

for (let i = 0; i < submitReplyCommentButtons.length; i++) {
    if(submitReplyCommentButtons[i].parentElement.classList[0].search("reply") === -1) // comment
        submitReplyCommentButtons[i].addEventListener("click", submitComment);
    else // reply
        submitReplyCommentButtons[i].addEventListener("click", submitReply);
}
// consider mergin all body click listeners to one function
document.body.addEventListener('click',function(){
    if(activatedRepIndex !== -1){
        repforms[activatedRepIndex].style.display = "none";
        activatedRepIndex = -1;
    }
});