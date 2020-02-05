// consider adding onerror to all ajaxes
// consider making a common function for that closure trick function
// todo: move post upload to here
// Function.prototype.bind function polyfil. todo: test on old browsers
// todo: add option to post a post via enter. consider making a global event listener for enter click
// todo: make a thumbnail for the videos using an attribute for the video element

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
    for (var i = 0; i < siblings.length; ++i)
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
    for(var i = 0; i < commentElements.length; ++i) 
        this.comments.push(new PostComment(commentElements[i], i, this));

    var video = postElement.querySelector("video"); // change here for pickpost double video
    
    if(video !== null)
        Video.videos.push(new Video(video.parentElement));
}
Post.activeDeleteButton    = null;
Post.activatedOptions      = null;
Post.activatedCommentForm  = null;
Post.posts                 = [];

Post.insertComment = function(post) { // an ajax callback function
    if(this.readyState === 4 && this.status === 200) {        
        var commentSection = post.postCon.querySelector(".comments");

        if(commentSection.childElementCount === 0)
            commentSection.insertAdjacentHTML("afterbegin", "<h2>Comments</h2>");

        Post.activatedCommentForm.firstElementChild.value = ""; // reset input
        Post.activatedCommentForm.style.display = "none";
        Post.activatedCommentForm = null;

        for (var i = 0; i < post.comments.length; ++i) // shift other comments' indices
            post.comments[i].index += 1;

        var comment = JSON.parse(this.responseText);
        var commentDOM = new CommentDOM(comment.properties, comment.replies);
        commentSection.firstElementChild.insertAdjacentElement("afterend", commentDOM.commentCon); // insert after h2 comment element
        post.comments.unshift(new PostComment(commentDOM.commentCon, 0, post)); // new comment is first
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
        formData.append("postIndex", this.index);
        if (siblings[starRate].src.indexOf("FilledStar.png") !== -1 && (!siblings[starRate + 1] || siblings[starRate + 1].src.indexOf("/Star.png") !== -1)) { // pressed again on same star - cancel
            formData.append("starRating", 0);
            for (var i = 1; i < 6; ++i)
                siblings[i].src = "/iconList/Star.png";
            userNum.innerHTML = parseInt(userNum.innerHTML) - 1;
        } else {
            if(siblings[1].src.indexOf("FilledStar.png") === -1) // not clicked on before
                userNum.innerHTML = parseInt(userNum.innerHTML) + 1;
            for (var i = 1; i <= starRate; ++i)
                siblings[i].src = "/iconList/FilledStar.png";
            for (var i = starRate + 1; i < 6; ++i)
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
        formData.append("postIndex", this.index);
        
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
        formData.append("postIndex", this.index);
        
        xmlhttp.open("POST", "templates/delete.php", true);
        xmlhttp.send(formData);

        this.postCon.remove();
        for (var i = this.index; i < Post.posts.length - 1; ++i) {
            Post.posts[i] = Post.posts[i + 1];
            --Post.posts[i].index;
        }
        Post.posts.pop();
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
    for(var i = 0; i < replyElements.length; ++i)
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

        if(PostComment.activatedReplyForm.nextElementSibling.nextElementSibling.style.display !== "block")
            PostComment.toggleReplies.call(PostComment.activatedReplyForm.nextElementSibling);

        PostComment.activatedReplyForm.firstElementChild.value = ""; // reset input
        PostComment.activatedReplyForm.style.display = "none";
        PostComment.activatedReplyForm = null;

        for (var i = 0; i < comment.replies.length; ++i) // shift reply indices by 1
            comment.replies[i].index += 1;

        var reply = new ReplyDOM(JSON.parse(this.responseText));
        comment.commentElement.querySelector(".replies").insertAdjacentElement("afterbegin", reply.replyDOM);
        comment.replies.unshift(new Reply(comment.commentElement.querySelector(".replydiv"), 0, comment));
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
        formData.append("postIndex", this.owningPost.index);
        formData.append("commentIndex", this.index);
        
        xmlhttp.open("POST", "templates/delete.php", true);
        xmlhttp.send(formData);

        for (var i = this.index; i < this.owningPost.comments.length - 1; ++i) {
            this.owningPost.comments[i] = this.owningPost.comments[i + 1];
            --this.owningPost.comments[i].index;
        }
        this.owningPost.comments.pop();
        
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
        if(PostComment.activeDeleteButton !== null)
            PostComment.activeDeleteButton.innerHTML = "delete";
        PostComment.activeDeleteButton = e.target;
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

        for (var i = this.index; i < this.owningComment.replies.length - 1; ++i) {
            this.owningComment.replies[i] = this.owningComment.replies[i + 1];
            --this.owningComment.replies[i].index;
        }
        this.owningComment.replies.pop();
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
            var commentObject = getPostCommentByIndex(postObject.index, getChildIndex(getOwningComment(document.activeElement)));
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
    var post = getPostByIndex(postIndex);
    var length = post.comments.length;
    for (var i = 0; i < length; ++i)
        if(post.comments[i].index === commentIndex)
            return post.comments[i];
}
function getPostByIndex(postIndex) {
    var length = Post.posts.length;
    for (var i = 0; i < length; ++i)
        if(Post.posts[i].index === postIndex)
            return Post.posts[i];
}
function Escancel(e){
    if(e.keyCode === 27)
        if (activeVideo !== null)
            activeVideo.toggleFullScreen();
}
function cancelFullscreen() {
    if(!document.fullscreen && activeVideo !== null)
        activeVideo.toggleFullScreen();
}
document.onwebkitfullscreenchange = cancelFullscreen;
document.onmozfullscreenchange = cancelFullscreen;
document.onfullscreenchange = cancelFullscreen;
document.addEventListener("keydown", Escancel, true);
//this is a test

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

var noMoreScroll = false;
// todo: deal with situation when call fails IMPORTANT
window.addEventListener("scroll", function() {
    // todo: change "300" to also support mobile 
    if ((window.innerHeight + window.pageYOffset) + 300 >= document.body.offsetHeight && !noMoreScroll)
        Post.loadPosts(3, function(response) { if(response === "") noMoreScroll = true; });
});

// IMPORTANT TODO (!!!): add protection
var finishedCall = true; // prevent multiple calls on same "reach end of document on scroll" event. consider abstracting to class
Post.loadPosts = function(numOfPosts, callback) {
    if(!finishedCall) return;
    var loadMorePosts = new XMLHttpRequest();
    finishedCall = false;
    loadMorePosts.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            finishedCall = true;
            if(this.responseText !== "") {
                var posts = JSON.parse(this.responseText);
                for (var i = 0; i < posts.length; ++i) {
                    var post = new PostDOM(posts[i].properties, posts[i].comments);
                    post.append();
                    Post.posts.push(new Post(post.postCon, Post.posts.length));
                }
            } else if(callback !== undefined)
                callback(this.responseText);
        }
    };
    var formData = new FormData();
    formData.append("numOfPosts", numOfPosts);
    loadMorePosts.open("POST", "templates/load.php", true);
    loadMorePosts.send(formData);
};
// todo: add loadning posts when cant scroll
//document.body.addEventListener("load", function() { Post.loadPosts(5); });
Post.loadPosts(5);