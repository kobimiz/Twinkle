// consider adding onerror to all ajaxes
// consider making a common function for that closure trick function
// todo: move post upload to here
// Function.prototype.bind function polyfil. todo: test on old browsers
// todo: add option to post a post via enter. consider making a global event listener for enter click

//this is a test
var mobcheck;

// function detectmob() { 
//     if( navigator.userAgent.match(/Android/i)
//     || navigator.userAgent.match(/webOS/i)
//     || navigator.userAgent.match(/iPhone/i)
//     || navigator.userAgent.match(/iPad/i)
//     || navigator.userAgent.match(/iPod/i)
//     || navigator.userAgent.match(/BlackBerry/i)
//     || navigator.userAgent.match(/Windows Phone/i)
//     ){
//         mobcheck = true;
//     }
//     else {
//         mobcheck = false;
//     }
// }
var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|Windows Phone/i.test(navigator.userAgent);
if (isMobile) {
      mobcheck = true;
} else {
    mobcheck = false;
}

//this is a test

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

function stopPropagation(e) {
    e.stopPropagation();
}
function getChildIndex(element) {
    var siblings = element.parentElement.children;
    for (var i = 0; i < siblings.length; i++)
        if (siblings[i] === element)
            return i;
    return -1;
}

// todo: improve event listeners system
// todo: benchmark using event listeners w\ prototype or with event argument
// todo: ask if one can rate oneself
function Post(postElement, index) {
    this.postCon  = postElement;
    this.index    = index;
    this.comments = [];

    postElement.querySelector(".comform"   ).addEventListener("click", stopPropagation              );
    postElement.querySelector(".optionscon").addEventListener("click", stopPropagation              ); // consider making one event listener
    postElement.querySelector(".submit"    ).addEventListener("click", this.submitComment.bind(this));
    postElement.querySelector(".optionicon").addEventListener("click", this.toggleOptions.bind(this));
    postElement.querySelector(".starrate"  ).addEventListener("click", this.rate.bind(this)         );
    postElement.querySelector(".act1"      ).addEventListener("click", this.toggleComment.bind(this));

    var delButton = postElement.querySelector(".deletepost");
    if(delButton !== null)
        delButton.addEventListener("click", this.delete.bind(this));

    // init comments
    var commentElements = postElement.querySelectorAll(".newarea");
    for(var i = 0; i < commentElements.length; i++) 
        this.comments.push(new PostComment(commentElements[i], i, this));

    var video = postElement.querySelector("video");
    if(video !== null)
        Video.videos.push(new Video(video.parentElement));
}
Post.activeDeleteButton    = null;
Post.activatedOptions      = null;
Post.activatedCommentForm  = null;
Post.posts                 = [];

Post.init = function() {
    var postElements = document.querySelectorAll(".postcon");
    for(var i = 0; i < postElements.length; i++)
        Post.posts.push(new Post(postElements[i], i));
};
Post.insertComment = function(post) { // an ajax callback function
    if(this.readyState === 4 && this.status === 200) {        
        var commentSection = post.postCon.querySelector(".comments");

        if(commentSection.childElementCount === 0)
            commentSection.insertAdjacentHTML("afterbegin", "<h2>Comments</h2>");
        commentSection.firstElementChild.insertAdjacentHTML("afterend", this.responseText);

        Post.activatedCommentForm.firstElementChild.value = ""; // reset input
        Post.activatedCommentForm.style.display = "none";
        Post.activatedCommentForm = null;

        for (var i = 0; i < post.comments.length; i++)
            post.comments[i].index += 1;
        post.comments.push(new PostComment(commentSection.querySelector(".newarea"), 0, post)); // new comment is first
    }
};
Post.prototype.rate = function(e) { // todo: fix stars moving aside when total star rating number gains more digits
    if (e.target.matches("img")) {
        var starRate = getChildIndex(e.target), // since there is a span element in e.target.parentElement, its child index is equal its star rate
            siblings = e.target.parentElement.children,
            xmlhttp = new XMLHttpRequest(),
            formData = new FormData(),
            userNum = this.postCon.querySelector(".usernum"),
            index = this.index;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var stats = this.responseText.split("\n");
                document.getElementsByClassName("avgstardata")[index].textContent = stats[0];
                document.getElementsByClassName("stars")[index].textContent = stats[1];
            }
        }
        formData.append("postIndex", Post.posts.length - this.index - 1);
        if (siblings[starRate].src.indexOf("FilledStar.png") !== -1 && (!siblings[starRate + 1] || siblings[starRate + 1].src.indexOf("Star.png") !== -1)) { // pressed again on same star - cancel
            formData.append("starRating", 0);
            for (var i = 1; i < 6; i++)
                siblings[i].src = "/iconList/Star.png";
            userNum.innerHTML = parseInt(userNum.innerHTML) - 1;
        } else {
            if(siblings[1].src.indexOf("FilledStar.png") === -1) // not clicked on before
                userNum.innerHTML = parseInt(userNum.innerHTML) + 1;
            for (var i = 1; i <= starRate; i++)
                siblings[i].src = "/iconList/FilledStar.png";
            for (var i = starRate + 1; i < 6; i++)
                siblings[i].src = "/iconList/Star.png";
            formData.append("starRating", starRate);
        }
        xmlhttp.open("POST", "templates/rate.php", true);
        xmlhttp.send(formData);
    }
};
Post.prototype.submitComment = function(e) { // todo: fix comment & reply order when submiting 2 and than refreshing.
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        xmlhttp.onreadystatechange = Post.insertComment.bind(xmlhttp, this);
        formData.append("content", val);
        formData.append("postIndex", Post.posts.length - this.index - 1);
        
        xmlhttp.open("POST", "templates/comment.php", true);
        xmlhttp.send(formData);
    }
};
Post.prototype.toggleComment = function(e) {
    var commentForm = this.postCon.querySelector(".comform");
    if(commentForm !== Post.activatedCommentForm) { // current comment not displayed
        if(Post.activatedCommentForm !== null) // hide last comment
            Post.activatedCommentForm.style.display = "none";
        commentForm.style.display = "block"; // display current comment
        commentForm.firstElementChild.focus(); // focus on input
        Post.activatedCommentForm = commentForm;
        e.stopPropagation();
    } else { // current comment already displayed
        commentForm.style.display = "none";
        Post.activatedCommentForm = null;
    }
};
Post.prototype.toggleOptions = function(e) {
    var options = this.postCon.querySelector(".optionscon");
    if(options !== Post.activatedOptions) { // current options arrow not displayed
        if(Post.activatedOptions !== null) // hide last options arrow
            Post.activatedOptions.style.display = "none";
        options.style.display = "block"; // display current options arrow
        Post.activatedOptions = options;
        e.stopPropagation();
    } else { // current options arrow already displayed
        options.style.display = "none";
        Post.activatedOptions = null;
    }
};
// todo: consider adding callbacks to all delete functions
Post.prototype.delete        = function( ) {
    var deletepost = this.postCon.querySelector(".deletepost");
    if(deletepost.innerHTML === "delete") {
        deletepost.innerHTML = "are you sure?";
        Post.activeDeleteButton = deletepost;
    }
    else {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        xmlhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200) 
                document.write(this.responseText);
        };
        formData.append("postIndex", Post.posts.length - this.index - 1);
        
        xmlhttp.open("POST", "templates/delete.php", true);
        xmlhttp.send(formData);

        this.postCon.remove();
        for (var i = 0; i < Post.posts.length; i++) {
            if(Post.posts[i].index === this.index)
                Post.posts.splice(i--, 1);
            else if(Post.posts[i].index > this.index)
                Post.posts[i].index -= 1;
        }
        Post.activeDeleteButton = null;
    }
};

function PostComment(commentElement, index, owningPost) {
    this.commentElement = commentElement;
    this.index          = index;
    this.owningPost     = owningPost;
    this.replies        = [];
    
    commentElement.querySelector(".submit"   ).addEventListener("click", this.submitReply.bind(this)           );
    commentElement.querySelector(".comreply" ).addEventListener("click", PostComment.toggleReplyForm.bind(this)); // reply button
    commentElement.querySelector(".replyform").addEventListener("click", stopPropagation                       );

    var comedelete = commentElement.querySelector(".comdelete");
    var viewMoreReplies = commentElement.querySelector(".viewMoreReplies");
    if(comedelete !== null) // can delete
        comedelete.addEventListener("click", this.delete.bind(this));
    if(viewMoreReplies !== null)
        viewMoreReplies.addEventListener("click", PostComment.toggleReplies);

    // init replies
    var replyElements = commentElement.querySelectorAll(".replydiv");
    for(var i = 0; i < replyElements.length; i++)
        this.replies.push(new Reply(replyElements[i], i, this));
}
PostComment.activeDeleteButton = null;
PostComment.activatedReplyForm = null;

PostComment.toggleReplies = function() {
    if(this.nextElementSibling.style.display === "block")
        this.nextElementSibling.style.display = "none";
    else
        this.nextElementSibling.style.display = "block";
};
PostComment.toggleReplyForm = function(e) {
    var replyForm = this.commentElement.querySelector(".replyform");
    if(replyForm !== PostComment.activatedReplyForm) { // current comment not displayed
        if(PostComment.activatedReplyForm !== null) // hide last comment
            PostComment.activatedReplyForm.style.display = "none";
        replyForm.style.display = "block"; // display current comment
        replyForm.firstElementChild.focus(); // focus on input
        PostComment.activatedReplyForm = replyForm;
        e.stopPropagation();
    } else { // current comment already displayed
        replyForm.style.display = "none";
        PostComment.activatedReplyForm = null;
    }
};
PostComment.insertReply = function(comment) { // an ajax callback function
   if(this.readyState === 4 && this.status === 200) {
        if(PostComment.activatedReplyForm.parentElement.querySelector(".viewMoreReplies") === null) { // has no replies
            PostComment.activatedReplyForm.insertAdjacentHTML("afterend", "<span class='viewMoreReplies'>View replies</span>\
                                                                            <div class='replies'></div>"); // add the view replies button
            PostComment.activatedReplyForm.nextElementSibling.addEventListener("click", PostComment.toggleReplies);
        }

        comment.commentElement.querySelector(".replies").insertAdjacentHTML("afterbegin", this.responseText);

        if(PostComment.activatedReplyForm.nextElementSibling.nextElementSibling.style.display !== "block")
            PostComment.toggleReplies.call(PostComment.activatedReplyForm.nextElementSibling);

        PostComment.activatedReplyForm.firstElementChild.value = ""; // reset input
        PostComment.activatedReplyForm.style.display = "none";
        PostComment.activatedReplyForm = null;

        for (var i = 0; i < comment.replies.length; i++)
            comment.replies[i].index += 1;
        comment.replies.push(new Reply(comment.commentElement.querySelector(".replydiv"), 0, comment));
   }
};

// consider making a general function
// todo: add here and in delete reply error handeling (e.g. using onreadystatechange)
PostComment.prototype.delete = function(e) {
    var button = this.commentElement.querySelector(".comdelete");
    if(button.innerHTML === "delete") { // consider rethinking
        button.innerHTML = "are you sure?";
        if(PostComment.activeDeleteButton !== null)
            PostComment.activeDeleteButton.innerHTML = "delete";
        PostComment.activeDeleteButton = e.target;
        e.stopPropagation();
    }
    else {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        formData.append("postIndex", Post.posts.length - this.owningPost.index);
        formData.append("commentIndex", this.index);
        
        xmlhttp.open("POST", "templates/delete.php", true);
        xmlhttp.send(formData);

        for (var i = 0; i < this.owningPost.comments.length; i++) {
            if(this.owningPost.comments[i].index === this.index)
                this.owningPost.comments.splice(i--, 1);
            else if(this.owningPost.comments[i].index > this.index)
                this.owningPost.comments[i].index -= 1;
        }
        this.commentElement.remove();
        var commentsHeader = this.owningPost.postCon.getElementsByTagName("h2")[0];
        if(commentsHeader.nextElementSibling === null)
            commentsHeader.remove();

        PostComment.activeDeleteButton = null;
    }
};
PostComment.prototype.submitReply = function(e) {
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        xmlhttp.onreadystatechange = PostComment.insertReply.bind(xmlhttp, this);
        formData.append("content", val);
        
        formData.append("commentIndex", this.index);
        formData.append("postIndex", Post.posts.length - this.owningPost.index);
        xmlhttp.open("POST", "templates/reply.php", true);
        xmlhttp.send(formData);
    }
};

function Reply(replyElement, index, owningComment) {
    // do something with note button
    this.replyElement = replyElement;
    this.index = index;
    this.owningComment = owningComment;

    var repdelete = replyElement.querySelector(".comdelete");
    if(repdelete !== null)
        repdelete.addEventListener("click", this.delete.bind(this));
}
Reply.prototype.delete = function(e) {
    var button = e.target;
    if(button.innerHTML === "delete") { // consider rethinking
        button.innerHTML = "are you sure?";
        if(PostComment.activeDeleteButton !== null)
            PostComment.activeDeleteButton.innerHTML = "delete";
        PostComment.activeDeleteButton = e.target;
        e.stopPropagation();
    }
    else {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        formData.append("postIndex", Post.posts.length - this.owningComment.owningPost.index);
        formData.append("commentIndex", this.owningComment.index);
        formData.append("replyIndex", this.index);
        xmlhttp.open("POST", "templates/delete.php", true);
        xmlhttp.send(formData);

        for (var i = 0; i < this.owningComment.replies.length; i++) {
            if(this.owningComment.replies[i].index === this.index)
                this.owningComment.replies.splice(i--, 1);
            else if(this.owningComment.replies[i].index > this.index)
                this.owningComment.replies[i].index -= 1;
        }
        this.replyElement.remove();
        var replies = this.owningComment.commentElement.querySelector(".replies");
        if(!replies.hasChildNodes()) {
            replies.previousElementSibling.remove();
            replies.remove();
        }

        PostComment.activeDeleteButton = null;
    }
};


document.getElementById("posts").addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
        var postObject = getPostByIndex(getChildIndex(getOwningPost(document.activeElement)));
        if(ownedByComment(document.activeElement)) {
            var commentObject = getPostCommentByIndex(postObject.index, getChildIndex(getOwningComment(document.activeElement)) - 1);
            commentObject.submitReply({target:document.activeElement});
        } else
            postObject.submitComment({target:document.activeElement});
    }
});

function getOwningPost(element) {
    while(true) {
        if(element.className == "postcon")
            return element;
        element = element.parentElement;
    }
}
function getOwningComment(element) {
    while(true) {
        if(element.className == "newarea")
            return element;
        element = element.parentElement;
    }
}
function ownedByComment(element) { // assumes element is at least in postElemenet
    while(element.className != "postcon") {
        if(element.className == "newarea")
            return true;
        element = element.parentElement;
    }
    return false;
}
function getPostCommentByIndex(postIndex, commentIndex) {
    var length = Post.posts[postIndex].comments.length;
    for (var i = 0; i < length; i++)
        if(Post.posts[postIndex].comments[i].index === commentIndex)
            return Post.posts[postIndex].comments[i];
}
function getPostByIndex(postIndex) {
    var length = Post.posts.length;
    for (var i = 0; i < length; i++)
        if(Post.posts[i].index === postIndex)
            return Post.posts[i];
}
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
    this.video.addEventListener("click", this.togglePlayMbl.bind(this));
    this.video.addEventListener("timeupdate", this.timeUpdate.bind(this));
    this.video.addEventListener("mousemove", this.manageBars.bind(this));
    // this.video.addEventListener("mouseleave", this.hideBars.bind(this));
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
    this.btn.addEventListener("click", this.togglePlayBtn.bind(this));
    this.volume.addEventListener("click", this.toggleVolume.bind(this));
    vConElement.querySelector(".right").addEventListener("click", this.forward.bind(this));
    vConElement.querySelector(".left").addEventListener("click", this.backward.bind(this));
    //this is a test
    this.volumeoff = vConElement.querySelector(".volumeoff");
    this.fullscreenicon = vConElement.querySelector(".fullscreen");
    this.fullscreenicon.addEventListener("click", this.toggleFullScreen.bind(this));
    this.Vcon = vConElement;
    this.video.addEventListener("dblclick", this.clickFullScreen.bind(this));
    this.playanime.addEventListener("click", this.HitStartVideo.bind(this));
    this.pauseanime.addEventListener("click", this.HitStartVideo.bind(this));
    //this is a test
}
Video.videos = [];
Video.prototype.togglePlayBtn = function() {
    if (this.video.paused) {
        this.btn.classList.add("pause");
        this.btn.classList.remove("play");
        this.video.play();
        if(mobcheck){
            this.playanime.style.opacity = "0";
            this.playanime.style.pointerEvents = "none";
            this.pauseanime.style.opacity = "0.7";
            this.pauseanime.style.pointerEvents = "auto";
        }else{
            this.playanime.classList.add("playanimeadd");
            setTimeout(this.removePlayAnimeAdd.bind(this), 1000); // ...
        }
    } else {
        this.btn.classList.add("play");
        this.btn.classList.remove("pause");
        this.video.pause();
        if(mobcheck){
            this.playanime.style.opacity = "0.7";
            this.playanime.style.pointerEvents = "auto";
            this.pauseanime.style.opacity = "0";
            this.pauseanime.style.pointerEvents = "none";
        }else{
            this.pauseanime.classList.add("pauseanimeadd");
            setTimeout(this.removePauseAnimeAdd.bind(this), 1000); // ...
        }
    }
};
//this is a test

document.body.addEventListener("click", function(e){
    console.log(e.target);
});

var BarsDir = true;
var VidStatus = true;

Video.prototype.HitStartVideo = function(){
    console.log(1);
    alert(1);
    if(this.video.paused){
        if(mobcheck){
            this.btn.classList.add("pause");
            this.btn.classList.remove("play");
            this.video.play();
            this.playanime.style.pointerEvents = "fill";
            this.playanime.style.opacity = "0";
            this.pauseanime.style.pointerEvents = "auto";
            this.pauseanime.style.opacity = "0.7";
            this.manageBars();
        }
    }else{
        this.btn.classList.add("play");
        this.btn.classList.remove("pause");
        this.video.pause();
        this.playanime.style.pointerEvents = "auto";
        this.playanime.style.opacity = "0.7";
        this.pauseanime.style.pointerEvents = "none";
        this.pauseanime.style.opacity = "0";
        this.manageBars();
    }
}

Video.prototype.togglePlayMbl = function() {
    if (this.video.paused) {
        if(mobcheck){
            if(BarsDir){
                this.manageBars();
                BarsDir = false;
            }else{
                this.hideBars();
                BarsDir = true;
            }
        }else{
            this.btn.classList.add("pause");
            this.btn.classList.remove("play");
            this.video.play();
            this.playanime.classList.add("playanimeadd");
            setTimeout(this.removePlayAnimeAdd.bind(this), 1000); // ...
        }
    } else {
        if(!mobcheck){
            this.btn.classList.add("play");
            this.btn.classList.remove("pause");
            this.video.pause();
            this.pauseanime.classList.add("pauseanimeadd");
            setTimeout(this.removePauseAnimeAdd.bind(this), 1000); // ...
        }else{
            if(BarsDir){
                this.manageBars();
                BarsDir = false;
            }else{
                this.hideBars();
                BarsDir = true;
            }
        }
    }
};

//this is a test
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
    if(mobcheck){
        if(this.video.paused){
            this.playanime.style.pointerEvents = "auto";
            this.playanime.style.opacity = "0.7";
        }else{
            this.pauseanime.style.pointerEvents = "auto";
            this.pauseanime.style.opacity = "0.7";
        }
    }
    this.closeBars = setTimeout(this.hideBars.bind(this), 2000);
};
Video.prototype.hideBars = function() {
    clearTimeout(this.setToNone);
    this.bottomBar.style.bottom = "-50px";
    this.topBar.style.top = "-50px";
    BarsDir = true;
    if(mobcheck){
        if(this.video.paused){
            this.playanime.style.pointerEvents = "none";
            this.playanime.style.opacity = "0";
            // this.setToNone = setTimeout(function(){this.playanime.style.pointerEvents = "none";}.bind(this), 600);
        }else{
            this.pauseanime.style.pointerEvents = "none";
            this.pauseanime.style.opacity = "0";
            // this.setToNone = setTimeout(function(){this.pauseanime.style.pointerEvents = "none";}.bind(this), 600);
        }
    }
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
        this.volumeoff.style.width = "30px";
        this.video.muted = true;
        this.volumecheck = true;

    } else {
        this.volumeoff.style.width = "0px";
        this.video.muted = false;
        this.volumecheck = false;
    }
}
Video.prototype.videoEnd = function() {
    this.btn.classList.add("play");
    this.btn.classList.remove("pause");
}
//this is a test
var activeVideo = null;
Video.prototype.clickFullScreen = function(){
    if (activeVideo === null){
        if (document.documentElement.requestFullScreen){
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen){
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen){
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullScreen){
            document.documentElement.msRequestFullScreen();
        }
        activeVideo = this;
        //change the css of the Vcon to full window size
        this.Vcon.classList.add("VconF");
        this.video.style.maxHeight = "unset";
        this.video.style.height = "100%";
        document.body.classList.add("bodyF");
    }else {
        activeVideo = null;
        //change the css of the Vcon when canceling full size
        this.Vcon.classList.remove("VconF");
        this.video.style.height = "unset";
        this.video.style.maxHeight = "500px";
        document.body.classList.remove("bodyF");
        if (document.cancelFullScreen){
            document.cancelFullScreen();
        }else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
        }else if(document.webkitCancelFullScreen){
            document.webkitCancelFullScreen();
        }else if(document.msCancelFullScreen){
            document.msCancelFullScreen();
        }
    }
}
Video.prototype.toggleFullScreen = function(){
    if (activeVideo === null){
        if (document.documentElement.requestFullScreen){
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen){
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen){
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullScreen){
            document.documentElement.msRequestFullScreen();
        }
        activeVideo = this;
        //change the css of the Vcon to full window size
        this.Vcon.classList.add("VconF");
        this.video.style.maxHeight = "unset";
        this.video.style.height = "100%";
        document.body.classList.add("bodyF");
    }else {
        activeVideo = null;
        //change the css of the Vcon when canceling full size
        this.Vcon.classList.remove("VconF");
        this.video.style.height = "unset";
        this.video.style.maxHeight = "500px";
        document.body.classList.remove("bodyF");
        if (document.cancelFullScreen){
            document.cancelFullScreen();
        }else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
        }else if(document.webkitCancelFullScreen){
            document.webkitCancelFullScreen();
        }else if(document.msCancelFullScreen){
            document.msCancelFullScreen();
        }
    }
}
function Escancel(e){
    if(e.keyCode === 27)
        if (activeVideo !== null)
            activeVideo.toggleFullScreen();
}
function cancelFullscreen() {
    if(!document.fullscreen)
        activeVideo.toggleFullScreen();
}
document.onwebkitfullscreenchange = cancelFullscreen;
document.onfullscreenchange = cancelFullscreen;
document.onmozfullscreenchange = cancelFullscreen;
document.addEventListener("keydown", Escancel, true);
//this is a test

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
    if(PostComment.activatedReplyForm !== null){
        PostComment.activatedReplyForm.style.display = "none";
        PostComment.activatedReplyForm = null;
    }
    if(Post.activeDeleteButton !== null) {
        Post.activeDeleteButton.innerHTML = "delete";
        Post.activeDeleteButton = null;
    }
    if(PostComment.activeDeleteButton !== null) {
        PostComment.activeDeleteButton.innerHTML = "delete";
        PostComment.activeDeleteButton = null;
    }
});
window.addEventListener("scroll", function() {
    if ((window.innerHeight + window.pageYOffset) + 300 >= document.body.offsetHeight) {
        var loadMorePosts = new XMLHttpRequest();
        loadMorePosts.onreadystatechange = function() { // todo: add restraint
            if (this.readyState == 4 && this.status == 200) {
                var posts = document.getElementById("posts");
                posts.insertAdjacentHTML("beforeend", this.responseText);
                Post.posts.push(new Post(posts.querySelector(".postcon:last-of-type"),Post.posts.length));
            }
        };
        var formData = new FormData();
        formData.append("lastPostIndex", document.getElementById("posts").childElementCount - 1);
        loadMorePosts.open("POST", "templates/load.php", true);
        loadMorePosts.send(formData);
    }
});
// todo: add loadning posts when cant scroll

Post.init();