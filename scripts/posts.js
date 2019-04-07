var video = document.querySelector(".video");
var btn = document.querySelector(".play-pause");
var leftBtn = document.querySelector(".left");
var rightBtn = document.querySelector(".right");
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

// consider adding onerror to all ajaxes
// consider making a common function for that closure trick function
// !!!!! todo: VVVVV
/*
var someInput = $0;
someInput.addEventListener('click', myFunc, false);
someInput.myParam = 'This is my parameter';
function myFunc(evt)
{
  window.alert( evt.target.myParam );
}
*/
// todo: move post upload to here
// todo: add delete\edit buttons
// Function.prototype.bind function polyfil. todo: test on old browser
if (!Function.prototype.bind) {
    Function.prototype.bind = function (context /* ...args */) {
      var fn = this;
      var args = Array.prototype.slice.call(arguments, 1);
  
      if (typeof(fn) !== 'function') {
        throw new TypeError('Function.prototype.bind - context must be a valid function');
      }
  
      return function () {
        return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      };
    };
}
function stopPropagation(e) { e.stopPropagation(); }
function getDate() {
    var today = new Date();
    return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
}
function getChildIndex(element) {
    var siblings = element.parentElement.children;
    for (var i = 0; i < siblings.length; i++)
        if (siblings[i] === element)
            return i;
    return -1;
};
// todo: improve event listeners system
// todo: benchmark using event listeners w\ prototype or with event argument
// todo: ask if one can rate oneself
function Post(postElement) {
    // consider rethinking
    this.commentForm = postElement.querySelector(".comform");
    this.options = postElement.querySelector(".optionscon");
    this.commentForm.addEventListener("click", stopPropagation);
    this.commentForm.querySelector(".submit").addEventListener("click", Post.submitComment.bind(this));
    postElement.querySelector(".optionicon").addEventListener("click", this.toggleOptions.bind(this));
    postElement.querySelector(".starrate").addEventListener("click", Post.rate);
    postElement.querySelector(".optionscon").addEventListener("click", stopPropagation);
    postElement.querySelector(".act1").addEventListener("click", this.toggleComment.bind(this));
}
Post.activatedOptions = null;
Post.activatedCommentForm = null;
Post.posts = [];
Post.rate = function(e) { // todo: fix possible exploit, fix stars moving aside when total star rating number gains more digits
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
};
// consider making get[Blank] one function (possibly use inheritance), or\and user Post.posts array
Post.init = function() {
    var postElements = document.querySelectorAll(".postcon");
    for(var i = 0; i < postElements.length; i++)
        Post.posts.push(new Post(postElements[i]));
};
Post.submitComment = function(e) { 
    // consider making one xmlhttp object for all ajaxes, but check only on it first
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = Post.insertComment;
        var formData = new FormData();
        formData.append("content", val);
        formData.append("postIndex", getChildIndex(e.target.parentElement.parentElement.parentElement));
        xmlhttp.open("POST", "templates/comment.php", true);
        xmlhttp.send(formData);
    } else {
        // .....
    }
}
Post.insertComment = function() { // an ajax callback function
    // consider removing the typerep name from the input element but first check its style with vscode search
   // consider removing autocomplete attribute from input
   if(this.readyState === 4 && this.status === 200) { // todo: fix commenting when there are no comments (possibly use adjacentHTML)
        var commentSection = Post.activatedCommentForm.nextElementSibling;
        if(commentSection.childElementCount === 0)
            commentSection.insertAdjacentHTML("afterbegin", "<h2>Comments</h2>");
        commentSection.firstElementChild.insertAdjacentHTML("afterend",
        '<div class="newarea"> \
            <div class="commentsarea"> \
            <div class="userD"> \
                <a class="userN"> \
                    <img alt="Profile photo" class="selfimg"> \
                    \
                </a> \
                <span class="commdate"></span> \
            </div> \
            <div class="commentcont"></div> \
            <div class="comset"> \
                <span class="comreply">reply</span> <span class="comnote">note</span> \
            </div> \
            </div> \
            <div class="replyform"> \
                <input name="typerep" type="text" placeholder="Reply..." autocomplete="off"> \
                <button class="submit">&gt;</button> \
            </div> \
        </div>');
        var res = this.responseText.split(','), // [username, profilePic]
            newComment = Post.activatedCommentForm.nextElementSibling.querySelector(".newarea"),
            userN = newComment.querySelector(".userN");
        userN.href = "profile.php?user=" + res[0];
        userN.childNodes[2].textContent = res[0];
        newComment.querySelector(".selfimg").src = res[1];
        newComment.querySelector(".commdate").textContent = getDate();
        newComment.querySelector(".commentcont").textContent = Post.activatedCommentForm.firstElementChild.value;
        Post.activatedCommentForm.firstElementChild.value = ""; // reset input
        Post.activatedCommentForm.style.display = "none"; // 
        Post.activatedCommentForm = null;
        Comment.comments.push(new Comment(newComment));
        console.log(this.responseText);
   }
}
Post.prototype.toggleComment = function(e) {
    if(this.commentForm !== Post.activatedCommentForm) { // current comment not displayed
        if(Post.activatedCommentForm !== null) // hide last comment
            Post.activatedCommentForm.style.display = "none";
        this.commentForm.style.display = "block"; // display current comment
        this.commentForm.firstElementChild.focus(); // focus on input
        Post.activatedCommentForm = this.commentForm;
        e.stopPropagation();
    } else { // current comment already displayed
        this.commentForm.style.display = "none";
        Post.activatedCommentForm = null;
    }
};
// consider rethinking
Post.prototype.toggleOptions = function(e) {
    if(this.options !== Post.activatedOptions) { // current options arrow not displayed
        if(Post.activatedOptions !== null) // hide last options arrow
            Post.activatedOptions.style.display = "none";
        this.options.style.display = "block"; // display current options arrow
        Post.activatedOptions = this.options;
        e.stopPropagation();
    } else { // current options arrow already displayed
        this.options.style.display = "none";
        Post.activatedOptions = null;
    }
};

function Comment(commentElement) {
    this.replyForm = commentElement.querySelector(".replyform");
    this.replyForm.querySelector(".submit").addEventListener("click", Comment.submitReply);
    commentElement.querySelector(".comreply").addEventListener("click", Comment.toggleReply.bind(this)); // reply button
    commentElement.querySelector(".replyform").addEventListener("click", stopPropagation);
}
Comment.activatedReplyForm = null;
Comment.comments = [];
Comment.toggleReply = function(e) {
    if(this.replyForm !== Comment.activatedReplyForm) { // current comment not displayed
        if(Comment.activatedReplyForm !== null) // hide last comment
            Comment.activatedReplyForm.style.display = "none";
        this.replyForm.style.display = "block"; // display current comment
        this.replyForm.firstElementChild.focus(); // focus on input
        Comment.activatedReplyForm = this.replyForm;
        e.stopPropagation();
    } else { // current comment already displayed
        this.replyForm.style.display = "none";
        Comment.activatedReplyForm = null;
    }
};
Comment.submitReply = function(e) {
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = Comment.insertReply;

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
Comment.insertReply = function() { // an ajax callback function
    // consider removing the typerep name from the input element but first check its style with vscode search
   // consider removing autocomplete attribute from input
   if(this.readyState === 4 && this.status === 200) {
       Comment.activatedReplyForm.insertAdjacentHTML("afterend",
       '<div class="replydiv"> \
           <div class="userD"> \
               <a class="userN"> \
                   <img alt="Profile photo" class="selfimg"> \
                   \
               </a> \
               <span class="commdate"></span> \
           </div> \
           <div class="replycont"></div> \
           <div class="comset"> \
               <span class="comnote">note</span> \
           </div> \
       </div>');
        var res = this.responseText.split(','), // [username, profilePic]
            newReply = Comment.activatedReplyForm.nextElementSibling,
            userN = newReply.querySelector(".userN");
        userN.href = "profile.php?user=" + res[0];
        userN.childNodes[2].textContent = res[0];
        newReply.querySelector(".selfimg").src = res[1];
        newReply.querySelector(".commdate").textContent = getDate();
        newReply.querySelector(".replycont").textContent = Comment.activatedReplyForm.firstElementChild.value;
        Comment.activatedReplyForm.firstElementChild.value = ""; // reset input
        Comment.activatedReplyForm.style.display = "none";
        Comment.activatedReplyForm = null;
        Reply.replies.push(new Reply(newReply));
   }
}
Comment.init = function() {
    var commentsElements = document.querySelectorAll(".newarea");
    for(var i = 0; i < commentsElements.length; i++)
        Comment.comments.push(new Comment(commentsElements[i]));
};

function Reply(replyElement) {
    // do something with note button
}
Reply.replies = [];
Reply.init = function() {
    var replyElements = document.querySelectorAll(".replydiv");
    for(var i = 0; i < replyElements.length; i++)
        Reply.replies.push(new Reply(replyElements[i]));
};

// consider making my own event system- one that takes advantage of multiple elements that have the same function for events (same events or consider even other)
// todo: add video pause on leaving the screen on scroll\playing another video
// consider rethiking bind function idea (efficiancy wise)
// todo: add keyboard arrow navigation in video (forward, backward etc)
function Video(vConElement) {
    this.video = vConElement.querySelector(".video");
    this.btn = vConElement.querySelector(".play-pause");
    this.videoJump = vConElement.querySelector(".videojump");
    this.bottomBar = vConElement.querySelector(".bottombar");
    this.topBar = vConElement.querySelector(".topbar");
    this.juiceBar = vConElement.querySelector(".juicebar");
    this.durTIme = vConElement.querySelector(".durtime");
    this.curTIme = vConElement.querySelector(".curtime");
    // todo: ask yehuda about two buttons instead of one
    this.playanime = vConElement.querySelector(".playanime");
    this.pauseanime = vConElement.querySelector(".pauseanime");
    this.volume = vConElement.querySelector(".volumeicon");
    this.volumecheck = false;
    this.closeBars; // is an intervalId
    this.mousedown = false; // duplicate!! todo: fix VVV
    this.isDown = false;
    this.startX;
    this.scrolLeft;
    this.pausedBeforeJump = true;
    // consider making a variable for bound functions for efficiency
    this.video.addEventListener("click", this.togglePlay.bind(this));
    this.video.addEventListener("timeupdate", this.timeUpdate.bind(this));
    this.video.addEventListener("mousemove", this.manageBars.bind(this));
    this.video.addEventListener("mouseleave", this.hideBars.bind(this));
    this.video.addEventListener("ended", this.videoEnd.bind(this));
    this.bottomBar.addEventListener("mousemove", this.manageBars.bind(this));
    this.bottomBar.addEventListener("mouseleave", this.hideBars.bind(this));
    this.topBar.addEventListener("mousemove", this.manageBars.bind(this));
    this.topBar.addEventListener("mouseleave", this.hideBars.bind(this));
    this.videoJump.addEventListener("click", this.jumpTime.bind(this));
    this.videoJump.addEventListener("mousemove", this.raiseMouse.bind(this)); // duplicate!!
    this.videoJump.addEventListener("mousemove", this.mouseMove.bind(this));
    this.videoJump.addEventListener("mouseleave", this.raiseMouse.bind(this));
    this.videoJump.addEventListener("mousedown", this.mouseDown.bind(this));
    this.videoJump.addEventListener("mouseup", this.mouseUp.bind(this));
    this.btn.addEventListener("click", this.togglePlay.bind(this));
    this.volume.addEventListener("click", this.toggleVolume.bind(this));
    vConElement.querySelector(".right").addEventListener("click", this.forward.bind(this));
    vConElement.querySelector(".left").addEventListener("click", this.backward.bind(this));
}
Video.videos = [];
Video.prototype.togglePlay = function() {
    if (this.video.paused) {
        this.btn.classList.add("pause");
        this.btn.classList.remove("play");
        this.video.play();
        this.pauseanime.classList.add("pauseanimeadd");
        setTimeout(this.removePauseAnimeAdd.bind(this), 1000); // ...
    } else {
        this.btn.classList.add("play");
        this.btn.classList.remove("pause");
        this.video.pause();
        this.playanime.classList.add("playanimeadd");
        setTimeout(this.removePlayAnimeAdd.bind(this), 1000); // ...
    }
};
Video.prototype.removePauseAnimeAdd = function() {
    this.pauseanime.classList.remove("pauseanimeadd");
};
Video.prototype.removePlayAnimeAdd = function() {
    this.playanime.classList.remove("playanimeadd");
};
Video.prototype.timeUpdate = function () {
    this.juiceBar.style.width = this.video.currentTime / this.video.duration * 100 + "%";
    // display time
    var curmins = Math.floor(this.video.currentTime / 60),
        cursecs = Math.round(this.video.currentTime - curmins * 60),
        durmins = Math.floor(this.video.duration / 60),
        dursecs = Math.round(this.video.duration - durmins * 60);
    if (cursecs < 10) // consider rethinking
        cursecs = "0" + cursecs;
    if (dursecs < 10)
        dursecs = "0" + dursecs;
    this.curTIme.innerHTML = curmins + ":" + cursecs;
    this.durTIme.innerHTML = durmins + ":" + dursecs;
};
Video.prototype.manageBars = function() {
    clearTimeout(this.closeBars);
    this.bottomBar.style.bottom = "0px";
    this.topBar.style.top = "0px";
    this.closeBars = setTimeout(this.hideBars.bind(this), 2000);
};
Video.prototype.hideBars = function() {
    this.bottomBar.style.bottom = "-40px";
    this.topBar.style.top = "-40px";
}
Video.prototype.forward = function() {
    this.video.currentTime += 5;
};
Video.prototype.backward = function() {
    this.video.currentTime -= 5;
};
Video.prototype.jumpTime = function(e) {
    this.video.currentTime = (e.offsetX / this.videoJump.offsetWidth) * this.video.duration;
};
Video.prototype.raiseMouse = function() {
    this.mousedown = false;
};
Video.prototype.mouseDown = function(e) { // consider renaming (confusion w this.mousedown)
    this.isDown = true;
    this.startX = e.pageX - this.videoJump.offsetLeft;
    this.scrolLeft = this.videoJump.scrollLeft;
    if (this.video.paused)
        this.pausedBeforeJump = true;
    else {
        this.pausedBeforeJump = false;
        this.video.pause();
    }
    this.btn.classList.add("play");
    this.btn.classList.remove("pause");
};
Video.prototype.mouseUp = function () {
    this.isDown = false;
    if (this.video.paused && !this.pausedBeforeJump) {
        this.btn.classList.add("pause");
        this.btn.classList.remove("play");
        this.video.play();
    } else{
        this.btn.classList.add("play");
        this.btn.classList.remove("pause");
    }
};
Video.prototype.mouseMove = function (e) {
    if (!this.isDown) return;
    e.preventDefault();
    var pos = e.pageX - this.videoJump.offsetLeft; // mouse position on X axis
    this.juiceBar.style.width = e.offsetX + "px";
    this.video.currentTime = (e.offsetX / this.videoJump.offsetWidth) * this.video.duration;
};
Video.prototype.toggleVolume = function(){
    if(!this.volumecheck) {
        this.volume.src = "/iconList/Volumeon.png";
        this.volume.style.width = "22px";
        this.volume.style.height = "20px";
        this.video.muted = true;
        this.volumecheck = true;

    } else {
        this.volume.src = "/iconList/Volumeoff.png";
        this.volume.style.width = "30px";
        this.volume.style.height = "35px";
        this.video.muted = false;
        this.volumecheck = false;
    }
}
Video.prototype.videoEnd = function() {
    this.btn.classList.add("play");
    this.btn.classList.remove("pause");
}
Video.init = function() {
    var videoElements = document.querySelectorAll(".video");
    for(var i = 0; i < videoElements.length; i++)
        Video.videos.push(new Video(videoElements[i].parentElement));
};


document.body.addEventListener('click', function(){
    if(Post.activatedCommentForm !== null){
        Post.activatedCommentForm.style.display = "none";
        Post.activatedCommentForm = null
    }
    if(Post.activatedOptions !== null) {
        Post.activatedOptions.style.display = "none";
        Post.activatedOptions = null;
    }
    if(Comment.activatedReplyForm !== null){
        Comment.activatedReplyForm.style.display = "none";
        Comment.activatedReplyForm = null;
    }
});
Post.init();
Comment.init();
Reply.init();
Video.init();

// function FPP() {
//     if (video.paused) {
//         btn.classList.add("pause");
//         btn.classList.remove("play");
//         video.play();
//     } else {
//         btn.classList.add("play");
//         btn.classList.remove("pause");
//         video.pause();
//     }
// }

// btn.onclick = FPP;
// video.onclick = FPP;
// video.ontimeupdate = function () {
//     if (video.ended) {
//         btn.classList.add("play");
//     }
// }
// leftBtn.onclick = function () {
//     video.currentTime += -5;
// }
// rightBtn.onclick = function () {
//     video.currentTime += +5;
// }

// video.addEventListener("timeupdate", function () {
//     var juicePos = video.currentTime / video.duration;
//     juiceBar.style.width = juicePos * 100 + "%";
// });

// // What the fuck is this & and 3 mousemove event listeners??? check this asap
// function scrub(event) {
//     var scrubTime = (event.offsetX / videojump.offsetWidth) * video.duration;
//     video.currentTime = scrubTime;
// }

// var mousedown = false;
// videojump.addEventListener("click", scrub);
// // removed the two firsts in class implementation. todo: update yehuda
// videojump.addEventListener("mousemove", (e) => mousedown && scrub(e));
// videojump.addEventListener("mousemove", (e) => mousedown = true);
// videojump.addEventListener("mousemove", (e) => mousedown = false);

// var closeBars;
// function manageBars() {
//     clearTimeout(closeBars);
//     bottombar.style.bottom = "0px";
//     topbar.style.top = "0px";
//     closeBars = setTimeout(function() {
//         bottombar.style.bottom = "-40px";
//         topbar.style.top = "-40px";
//     }, 2000);
// }
// function hideBars() {
//     bottombar.style.bottom = "-40px";
//     topbar.style.top = "-40px";
// }

// video.addEventListener("mousemove", manageBars);
// bottombar.addEventListener("mousemove", manageBars);
// topbar.addEventListener("mousemove", manageBars);

// video.addEventListener("mouseleave", hideBars);
// bottombar.addEventListener("mouseleave", hideBars);
// topbar.addEventListener("mouseleave", hideBars);

// /* sliding the juiceBar and changing currentTime position */
// var isDown = false;
// var startX;
// var scrolLeft;
// var pausedBeforeJump = true;

// videojump.addEventListener("mousedown", function (e) {
//     isDown = true;
//     startX = e.pageX - videojump.offsetLeft;
//     scrolLeft = videojump.scrollLeft;
//     if (video.paused)
//         pausedBeforeJump = true;
//     else {
//         pausedBeforeJump = false;
//         video.pause();
//     }
//     btn.classList.add("play");
//     btn.classList.remove("pause");
// });

// videojump.addEventListener("mouseleave", function () {
//     isDown = false;
// });

// videojump.addEventListener("mouseup", function () {
//     isDown = false;
//     if (video.paused && !pausedBeforeJump) {
//         btn.classList.add("pause");
//         btn.classList.remove("play");
//         video.play();
//     } else{
//         btn.classList.add("play");
//         btn.classList.remove("pause");
//     }
// });

// videojump.addEventListener("mousemove", function (e) {
//     if (!isDown) return;
//     e.preventDefault();
//     const pos = e.pageX - videojump.offsetLeft; // mouse position on X axis
//     const run = pos - startX; // mouse distance from starting point
//     juiceBar.style.width = juiceBar.offsetWidth + (e.offsetX - juiceBar.offsetWidth) + "px";
//     video.currentTime = (e.offsetX / videojump.offsetWidth) * video.duration;
// });

// // red line lenght plus mouse distance


// video.addEventListener("timeupdate", displaytime, false);

// function displaytime() {
//     var curmins = Math.floor(video.currentTime / 60);
//     var cursecs = Math.round(video.currentTime - curmins * 60);
//     var durmins = Math.floor(video.duration / 60);
//     var dursecs = Math.round(video.duration - durmins * 60);
//     if (cursecs < 10) {
//         cursecs = "0" + cursecs;
//     }
//     if (dursecs < 10) {
//         dursecs = "0" + dursecs;
//     }
//     curTIme.innerHTML = curmins + ":" + cursecs;
//     durTIme.innerHTML = durmins + ":" + dursecs;

// }

// volume.addEventListener("click",function(){
//     if(!volumecheck){
//         volume.src = "/iconList/Volumeon.png";
//         volume.style.width = "22px";
//         volume.style.height = "20px";
//         video.muted = true;
//         volumecheck = true;

//     }else{
//         volume.src = "/iconList/Volumeoff.png";
//         volume.style.width = "30px";
//         volume.style.height = "35px";
//         video.muted = false;
//         volumecheck = false;
//     }
// });

// /*<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>*/
// //<<<<<<<>>>>>>>>
// // consider setting already existing functions to timeOut for there would be multiple videos
// video.addEventListener("click", function () {
//     if (video.paused) {
//         pauseanime.classList.add("pauseanimeadd");
//         setTimeout(function() { pauseanime.classList.remove("pauseanimeadd"); }, 1000);
//     } else if (video.play) {
//         playanime.classList.add("playanimeadd");
//         setTimeout(function() { playanime.classList.remove("playanimeadd"); }, 1000);
//     }
// });

/*<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>*/

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
//reply click anime