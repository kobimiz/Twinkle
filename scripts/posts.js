// consider adding onerror to all ajaxes
// consider making a common function for that closure trick function
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

// consider not storing variables inside
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
            postIndex = getChildIndex(this.parentElement.parentElement.parentElement),
            userNum = e.target.parentElement.nextElementSibling.children[1];
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
// consider making get[Blank] one function (possibly use inheritance), or\and user Post.posts array
Post.init = function() {
    var postElements = document.querySelectorAll(".postcon");
    for(var i = 0; i < postElements.length; i++)
        Post.posts.push(new Post(postElements[i]));
};
Post.submitComment = function(e) { // todo: fix comment & reply order when submiting 2 and than refreshing.
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
    }
}
Post.insertComment = function() { // an ajax callback function
    // consider removing the typerep name from the input element but first check its style with vscode search
    // consider removing autocomplete attribute from input
    if(this.readyState === 4 && this.status === 200) { // todo: fix commenting when there are no comments (possibly use adjacentHTML)
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
            </div> \
            </div> \
            <div class="replyform"> \
                <input name="typerep" type="text" placeholder="Reply..." autocomplete="off"> \
                <button class="submit">&gt;</button> \
            </div> \
        </div>');
        Comment.comments.push(new Comment(Post.activatedCommentForm.nextElementSibling.querySelector(".newarea")));
        Post.activatedCommentForm.firstElementChild.value = ""; // reset input
        Post.activatedCommentForm.style.display = "none"; // 
        Post.activatedCommentForm = null;
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
    var viewMoreReplies = commentElement.querySelector(".viewMoreReplies"),
        comedit = commentElement.querySelector(".comedit");
    this.replyForm = commentElement.querySelector(".replyform");
    this.replyForm.querySelector(".submit").addEventListener("click", Comment.submitReply);
    commentElement.querySelector(".comreply").addEventListener("click", Comment.toggleReplyForm.bind(this)); // reply button
    commentElement.querySelector(".replyform").addEventListener("click", stopPropagation);
    if(viewMoreReplies !== null)
        viewMoreReplies.addEventListener("click", Comment.toggleReplies);
    if(comedit !== null) { // can edit/delete
        commentElement.querySelector(".comedit").addEventListener("click", Comment.toggleEdit);
        commentElement.querySelector(".comdelete").addEventListener("click", Comment.delete);
    }
}
Comment.activatedReplyForm = null;
Comment.comments = [];
// todo: add last edited date (also for replies and posts)
// todo: fix exploit where you can delete/ change stuff thats isnt yours
Comment.toggleEdit = function() {
    var comment = this.parentElement.previousElementSibling;
    if(comment.style.display === "none") {
        var input = comment.previousElementSibling.previousElementSibling,
            xmlhttp = new XMLHttpRequest();
        // xmlhttp.onreadystatechange = Post.insertComment; consider changing styles etc here instead of doing so imediatly. also consider this for post, comment and reply
        var formData = new FormData();
        formData.append("content", input.value);
        formData.append("postIndex", getChildIndex(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement));
        formData.append("commentIndex", getChildIndex(this.parentElement.parentElement.parentElement) - 1);
        xmlhttp.open("POST", "templates/edit.php", true);
        xmlhttp.send(formData);

        input.nextElementSibling.remove(); // remove cancel button
        comment.innerHTML = input.value;
        input.remove();
        comment.style.display = "block";
        this.innerHTML = "edit";
    } else {
        this.innerHTML = "confirm";
        var cancel = document.createElement("span"),
            input = document.createElement("input");
        input.type = "text";
        input.value = comment.innerHTML;
        cancel.style.cursor = "pointer";
        cancel.innerHTML = " Cancel";
        comment.style.display = "none";
        comment.parentElement.insertBefore(input, comment);
        comment.parentElement.insertBefore(cancel, comment);
    }
};
// consider making a general function
Comment.delete = function() {
    if(this.innerHTML === "delete") // consider rethinking
        this.innerHTML = "are you sure?";
    else {
        var xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        formData.append("postIndex", getChildIndex(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement));
        formData.append("commentIndex", getChildIndex(this.parentElement.parentElement.parentElement) - 1);
        xmlhttp.open("POST", "templates/delete.php", true);
        xmlhttp.send(formData);

        this.parentElement.parentElement.parentElement.remove();
        Comment.comments.splice(indexOfCommentArray(Comment.comments, this.parentElement.parentElement.nextElementSibling), 1); // rethink this. temporary solution
    }
};
function indexOfCommentArray(comments, replyForm) {
    for (let i = 0; i < comments.length; i++) {
        if(comments[i].replyForm === replyForm)
            return i;
    }
    return -1;
}
Comment.toggleReplies = function() {
    if(this.nextElementSibling.style.display === "block")
        this.nextElementSibling.style.display = "none";
    else
        this.nextElementSibling.style.display = "block";
};
Comment.toggleReplyForm = function(e) {
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
    }
}
Comment.insertReply = function() { // an ajax callback function
    // consider removing the typerep name from the input element but first check its style with vscode search
   // consider removing autocomplete attribute from input
   if(this.readyState === 4 && this.status === 200) {
        if(Comment.activatedReplyForm.parentElement.querySelector(".viewMoreReplies") === null) { // has no replies
            Comment.activatedReplyForm.insertAdjacentHTML("afterend", "<span class='viewMoreReplies'>View replies</span>"); // add the view replies button
            Comment.activatedReplyForm.nextElementSibling.addEventListener("click", Comment.toggleReplies);
            Comment.toggleReplies.call(Comment.activatedReplyForm.nextElementSibling);
        }
        var res = this.responseText.split(','), // [username, profilePic]
            replies = Comment.activatedReplyForm.nextElementSibling.nextElementSibling;
        replies.insertAdjacentHTML("afterbegin",
        '<div class="replydiv"> \
            <div class="userD"> \
                <a href="profile.php?user="' + res[0]  + '" class="userN"> \
                    <img src="' + res[1] + '" alt="Profile photo" class="selfimg">' + 
                    res[0] +
                '</a> \
                <span class="commdate">' + getDate() + '</span> \
            </div> \
            <div class="replycont">' + Comment.activatedReplyForm.firstElementChild.value + '</div> \
            <div class="comset"> \
                <span class="comnote">note</span> \
            </div> \
        </div>');
        Reply.replies.push(new Reply(replies.firstElementChild));
        Comment.activatedReplyForm.firstElementChild.value = ""; // reset input
        Comment.activatedReplyForm.style.display = "none";
        Comment.activatedReplyForm = null;
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
/*window.addEventListener("scroll", function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        var loadMorePosts = new XMLHttpRequest();
        loadMorePosts.onloadstart = function() { document.getElementById("showMore").style.display = "block"; }; // todo: fix flickering
        loadMorePosts.onloadend = function() { document.getElementById("showMore").style.display = "none"; };
        loadMorePosts.onreadystatechange = function() { // todo: add restraint
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                var div = document.createElement("div");
                div.innerHTML = "1234";
                div.style.height = "400px";
                document.querySelector("#posts").appendChild(div);
            }
        };
        console.log("bottom");
        var formData = new FormData();
        formData.append("lastPostIndex", document.getElementById("posts").childElementCount - 1);
        loadMorePosts.open("POST", "templates/load.php", true);
        loadMorePosts.send(formData);
    }
});*/

Post.init();
Comment.init();
Reply.init();
Video.init();

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