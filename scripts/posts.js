// consider adding onerror to all ajaxes
// consider making a common function for that closure trick function
// todo: move post upload to here
// Function.prototype.bind function polyfil. todo: test on old browsers
// todo: add option to post a post via enter. consider making a global event listener for enter click
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
}

// consider not storing variables inside
// todo: improve event listeners system
// todo: benchmark using event listeners w\ prototype or with event argument
// todo: ask if one can rate oneself
function Post(postElement, index) {
    // consider rethinking
    this.index = index;
    this.comments = [];
    this.commentForm = postElement.querySelector(".comform");
    this.options = postElement.querySelector(".optionscon");
    this.commentForm.addEventListener("click", stopPropagation);
    this.commentForm.querySelector(".submit").addEventListener("click", this.submitComment.bind(this));
    postElement.querySelector(".optionicon").addEventListener("click", this.toggleOptions.bind(this));
    postElement.querySelector(".starrate").addEventListener("click", this.rate.bind(this));
    postElement.querySelector(".optionscon").addEventListener("click", stopPropagation);
    postElement.querySelector(".act1").addEventListener("click", this.toggleComment.bind(this));

    // init comments
    var commentElements = postElement.querySelectorAll(".newarea");
    for(var i = 0; i < commentElements.length; i++) 
        this.comments.push(new PostComment(commentElements[i], i, this));

    var video = postElement.querySelector("video");
    if(video !== null)
        Video.videos.push(new Video(video.parentElement));
}
Post.activatedDeleteButton = null;
Post.activatedOptions = null;
Post.activatedCommentForm = null;
Post.posts = [];

// consider making get[Blank] one function (possibly use inheritance), or\and user Post.posts array
Post.init = function() {
    var postElements = document.querySelectorAll(".postcon");
    for(var i = 0; i < postElements.length; i++)
        Post.posts.push(new Post(postElements[i], i));
};
Post.insertComment = function(post) { // an ajax callback function
    // consider removing the typerep name from the input element but first check its style with vscode search
    // consider removing autocomplete attribute from input
    if(this.readyState === 4 && this.status === 200) {        
        var commentSection = Post.activatedCommentForm.nextElementSibling,
            res = this.responseText.split(','); // [username, profilePic]
        if(commentSection.childElementCount === 0)
            commentSection.insertAdjacentHTML("afterbegin", "<h2>Comments</h2>");
        commentSection.firstElementChild.insertAdjacentHTML("afterend",
        '<div class="newarea"> \
            <div class="commentsarea"> \
            <div class="userD"> \
                <a href="profile.php?user=' + res[0] + '" class="userN"> \
                    <img alt="Profile photo" src="' + res[1] + '" class="selfimg">' +
                    res[0] +
                '</a> \
                <span class="commdate">' + getDate() + '</span> \
            </div> \
            <div class="commentcont">' + Post.activatedCommentForm.firstElementChild.value + '</div> \
            <div class="comset"> \
                <span class="comreply">reply</span> <span class="comnote">note</span> \
                <span class="comdelete">delete</span> \
            </div> \
            </div> \
            <div class="replyform"> \
                <input name="typerep" type="text" placeholder="Reply..." autocomplete="off"> \
                <button class="submit">&gt;</button> \
            </div> \
        </div>');
        Post.activatedCommentForm.firstElementChild.value = ""; // reset input
        Post.activatedCommentForm.style.display = "none";
        Post.activatedCommentForm = null;

        for (var i = 0; i < post.comments.length; i++)
            post.comments[i].index += 1;
        post.comments.push(new PostComment(commentSection.children[1], 0, post));
    }
};

Post.prototype.rate = function(e) { // todo: fix stars moving aside when total star rating number gains more digits
    if (e.target.matches("img")) {
        var starRate = getChildIndex(e.target), // since there is a span element in e.target.parentElement, its child index is equal its star rate
            siblings = e.target.parentElement.children,
            xmlhttp = new XMLHttpRequest(),
            formData = new FormData(),
            userNum = e.target.parentElement.nextElementSibling.children[1],
            index = this.index;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var stats = this.responseText.split("\n");
                document.getElementsByClassName("avgstardata")[index].textContent = stats[0];
                document.getElementsByClassName("stars")[index].textContent = stats[1];
            }
        }
        formData.append("postIndex", index);
        if (siblings[starRate].src.indexOf("FilledStar.png") !== -1 && (!siblings[starRate + 1] || siblings[starRate + 1].src.indexOf("RateStar.svg") !== -1)) { // pressed again on same star - cancel
            formData.append("starRating", 0);
            for (var i = 1; i < 6; i++)
                siblings[i].src = "/iconList/RateStar.svg";
            userNum.innerHTML = parseInt(userNum.innerHTML) - 1;
        } else {
            if(siblings[1].src.indexOf("FilledStar.png") === -1) // not clicked on before
                userNum.innerHTML = parseInt(userNum.innerHTML) + 1;
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
Post.prototype.submitComment = function(e) { // todo: fix comment & reply order when submiting 2 and than refreshing.
    var val = e.target.parentElement.children[0].value;
    if(val !== "") {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        xmlhttp.onreadystatechange = Post.insertComment.bind(xmlhttp, this);
        formData.append("content", val);
        formData.append("postIndex", this.index);
        
        xmlhttp.open("POST", "templates/comment.php", true);
        xmlhttp.send(formData);
    }
};
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

function PostComment(commentElement, index, owningPost) {
    this.commentElement = commentElement;
    this.index = index;
    this.owningPost = owningPost;
    this.replies = [];
    this.replyForm = commentElement.querySelector(".replyform");
    this.replyForm.querySelector(".submit").addEventListener("click", this.submitReply.bind(this));
    commentElement.querySelector(".comreply").addEventListener("click", PostComment.toggleReplyForm.bind(this)); // reply button
    commentElement.querySelector(".replyform").addEventListener("click", stopPropagation);

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
PostComment.activatedReplyForm = null;

function indexOfCommentArray(comments, replyForm) {
    for (var i = 0; i < comments.length; i++) {
        if(comments[i].replyForm === replyForm)
            return i;
    }
    return -1;
}
PostComment.toggleReplies = function() {
    if(this.nextElementSibling.style.display === "block")
        this.nextElementSibling.style.display = "none";
    else
        this.nextElementSibling.style.display = "block";
};
PostComment.toggleReplyForm = function(e) {
    if(this.replyForm !== PostComment.activatedReplyForm) { // current comment not displayed
        if(PostComment.activatedReplyForm !== null) // hide last comment
            PostComment.activatedReplyForm.style.display = "none";
        this.replyForm.style.display = "block"; // display current comment
        this.replyForm.firstElementChild.focus(); // focus on input
        PostComment.activatedReplyForm = this.replyForm;
        e.stopPropagation();
    } else { // current comment already displayed
        this.replyForm.style.display = "none";
        PostComment.activatedReplyForm = null;
    }
};
PostComment.insertReply = function(comment) { // an ajax callback function
    // consider removing the typerep name from the input element but first check its style with vscode search
   // consider removing autocomplete attribute from input
   if(this.readyState === 4 && this.status === 200) {
        if(PostComment.activatedReplyForm.parentElement.querySelector(".viewMoreReplies") === null) { // has no replies
            PostComment.activatedReplyForm.insertAdjacentHTML("afterend", "<span class='viewMoreReplies'>View replies</span>\
                                                                            <div class='replies'></div>"); // add the view replies button
            PostComment.activatedReplyForm.nextElementSibling.addEventListener("click", PostComment.toggleReplies);
        }
        var res = this.responseText.split(','), // [username, profilePic]
            replies = PostComment.activatedReplyForm.nextElementSibling.nextElementSibling;
        
        replies.insertAdjacentHTML("afterbegin",
        '<div class="replydiv"> \
            <div class="userD"> \
                <a href="profile.php?user="' + res[0]  + '" class="userN"> \
                    <img src="' + res[1] + '" alt="Profile photo" class="selfimg">' + 
                    res[0] +
                '</a> \
                <span class="commdate">' + getDate() + '</span> \
            </div> \
            <div class="replycont">' + PostComment.activatedReplyForm.firstElementChild.value + '</div> \
            <div class="comset"> \
                <span class="comnote">note</span> \
                <span class="comdelete">delete</span> \
            </div> \
        </div>');


        if(PostComment.activatedReplyForm.nextElementSibling.nextElementSibling.style.display !== "block")
            PostComment.toggleReplies.call(PostComment.activatedReplyForm.nextElementSibling);

        PostComment.activatedReplyForm.firstElementChild.value = ""; // reset input
        PostComment.activatedReplyForm.style.display = "none";
        PostComment.activatedReplyForm = null;

        for (var i = 0; i < comment.replies.length; i++)
            comment.replies[i].index += 1;
        comment.replies.push(new Reply(replies.children[0], 0, comment));
   }
};

// consider making a general function
// todo: add here and in delete reply error handeling (e.g. using onreadystatechange)
PostComment.prototype.delete = function(e) {
    var button = this.commentElement.querySelector(".comdelete");
    if(button.innerHTML === "delete") { // consider rethinking
        button.innerHTML = "are you sure?";
        if(Post.activatedDeleteButton !== null)
            Post.activatedDeleteButton.innerHTML = "delete";
        Post.activatedDeleteButton = e.target;
        e.stopPropagation();
    }
    else {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        formData.append("postIndex", this.owningPost.index);
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
        var commentsHeader = this.owningPost.commentForm.nextElementSibling.firstElementChild;
        if(commentsHeader.nextElementSibling === null)
            commentsHeader.remove();

        Post.activatedDeleteButton = null;
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
        formData.append("postIndex", this.owningPost.index);
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
        if(Post.activatedDeleteButton !== null)
            Post.activatedDeleteButton.innerHTML = "delete";
        Post.activatedDeleteButton = e.target;
        e.stopPropagation();
    }
    else {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        formData.append("postIndex", this.owningComment.owningPost.index);
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

        Post.activatedDeleteButton = null;
    }
};


document.getElementById("posts").addEventListener("keydown", function(e) {
    if(e.key === "Enter" || e.target.className == "submit") {
        var postObject = Post.posts[getChildIndex(getOwningPost(document.activeElement))];
        if(ownedByComment(document.activeElement)) {
            var commentObject = postObject.comments[getChildIndex(getOwningComment(document.activeElement)) - 1];
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
    //this is a test
    this.fullscreenicon = vConElement.querySelector(".fullscreen");
    this.fullscreenicon.addEventListener("click", this.toggleFullScreen.bind(this));
    this.Vcon = vConElement;
    //this is a test
}
Video.videos = [];
Video.prototype.togglePlay = function() {
    if (this.video.paused) {
        this.btn.classList.add("pause");
        this.btn.classList.remove("play");
        this.video.play();
        this.playanime.classList.add("playanimeadd");
        setTimeout(this.removePlayAnimeAdd.bind(this), 1000); // ...
    } else {
        this.btn.classList.add("play");
        this.btn.classList.remove("pause");
        this.video.pause();
        this.pauseanime.classList.add("pauseanimeadd");
        setTimeout(this.removePauseAnimeAdd.bind(this), 1000); // ...
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
    this.bottomBar.style.bottom = "-50px";
    this.topBar.style.top = "-50px";
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
//this is a test
console.log(Video.video)
Video.prototype.toggleFullScreen = function(){
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
    (!document.mozFullScreen && !document.webkitIsFullScreen)){
            //change the css of the Vcon to full window size
            this.Vcon.classList.add("VconF");
            this.video.style.maxHeight = "unset";
            this.video.style.height = "100%";
            this.video.style.margin = "auto 0";
            // this.video.style.background = "black";
            document.body.classList.add("bodyF");
        if (document.documentElement.requestFullScreen){
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen){
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen){
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }else{
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
        }
    }
}
//a variable of an array with all the Vcon and find the one with VconF
var VcF = document.querySelectorAll(".Vcon");
var VcFv = document.querySelectorAll(".Vcon>video");
function VcEach(){
    for(var i = 0; i < VcF.length; i++){
        VcF[i].classList.remove("VconF");
    }
}
function VcvEach(){
    for(var i = 0; i < VcFv.length; i++){
        VcFv[i].style.height = "unset";
        VcFv[i].style.maxHeight = "500px";
    }
}
//-----------
function Escancel(e){
    if(e.keyCode === 27){
        console.log(VcF);
        // if(globVcon.className == "Vcon VconF"){
            // VcFv.style.height = "unset";
            // VcFv.style.maxHeight = "500px";
            // VcF.classList.remove("VconF");
            VcF.forEach(VcEach);
            VcF.forEach(VcvEach);
            document.body.classList.remove("bodyF");
        // }
    }
}
document.onwebkitfullscreenchange = function() {
    if(!document.fullscreen) {
        // VcFv.style.height = "unset";
        // VcFv.style.maxHeight = "500px";
        // VcF.classList.remove("VconF");
        VcF.forEach(VcEach);
        VcF.forEach(VcvEach);
        document.body.classList.remove("bodyF");
    }
};
document.onfullscreenchange = function() {
    if(!document.fullscreen) {
        // VcFv.style.height = "unset";
        // VcFv.style.maxHeight = "500px";
        // VcF.classList.remove("VconF");
        VcF.forEach(VcEach);
        VcF.forEach(VcvEach);
        document.body.classList.remove("bodyF");
    }
};
document.onmozfullscreenchange = function() {
    if(!document.fullscreen) {
        // VcFv.style.height = "unset";
        // VcFv.style.maxHeight = "500px";
        // VcF.classList.remove("VconF");
        VcF.forEach(VcEach);
        VcF.forEach(VcvEach);
        document.body.classList.remove("bodyF");
    }
};
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
    if(Post.activatedDeleteButton !== null) {
        Post.activatedDeleteButton.innerHTML = "delete";
        Post.activatedDeleteButton = null;
    }
});
window.addEventListener("scroll", function() {
    if ((window.innerHeight + window.pageYOffset) + 300 >= document.body.offsetHeight) {
        var loadMorePosts = new XMLHttpRequest();
        loadMorePosts.onreadystatechange = function() { // todo: add restraint
            if (this.readyState == 4 && this.status == 200) {
                var posts = document.querySelector("#posts");
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