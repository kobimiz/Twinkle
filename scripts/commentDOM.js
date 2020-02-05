"use strict"
// consider making all parameters except replies an object, like in PostDOM
function CommentDOM(properties, replies) {
    this.commentCon = document.createElement("div");
    this.commentCon.classList.add("newarea");
    this.commentCon.insertAdjacentHTML("afterbegin",
    "<div class='commentsarea'>\
        <div class='userD'>\
            <a href='" + properties.commentorProfileLink + "' class='userN'>\
                <img alt='Profile photo' src='" + properties.commentorImageSrc + "' class='selfimg'>" + properties.commentorName + "</a>\
            <span class='commdate'>" + properties.date + "</span>\
        </div>\
    \
        <div class='commentcont'>" + properties.content + "</div>" +
        CommentDOM.comsetDOMString(properties.isViewerCommentor) +
        "</div>\
    <div class='replyform'>\
        <input name='typerep' type='text' placeholder='Reply...' autocomplete='off'>\
        <button class='submit'>&gt;</button>\
    </div>");

    if(replies.length > 0) {
        var viewRepliesDOM = document.createElement("div");
        viewRepliesDOM.classList.add("viewMoreReplies");
        viewRepliesDOM.textContent = "View replies";
        this.commentCon.append(viewRepliesDOM);

        var repliesDOM = document.createElement("div");
        repliesDOM.classList.add("replies");
        for (var i = 0; i < replies.length; ++i) {
            var replyDOM = new ReplyDOM(replies[i]);
            repliesDOM.append(replyDOM.replyDOM);
        }
        this.commentCon.append(repliesDOM);
    }
}

CommentDOM.comsetDOMString = function(isViewerCommentor) {
    var DOMString =
    "<div class='comset'>\
        <span class='comreply'>reply</span>\
        <span class='comnote'>note</span>";
    if(isViewerCommentor) {
        DOMString +=
        "<span class='comdelete'>delete</span>";
    }
    DOMString += 
    "</div>";
    return DOMString;
};