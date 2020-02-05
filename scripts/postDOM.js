"use strict"

// a class to construct a Post DOM element
// consider using the username parameter for the profile link
// consider using something more efficient than insertAdjacentHTML
// consider making a custom html element
// todo: add documentation
// todo: seriously work on namings on postDOM/commentDOM/replyDOM and corresponding PHP files
function PostDOM(properties, comments) {
    this.postCon = document.createElement("div");
    this.postCon.classList.add("postcon");
    this.postCon.insertAdjacentHTML("afterbegin",
    "<div class='contentcon'>\
        <div class='topdata'>\
            <span class='avgstar'><img src='iconList/FilledStar.png' alt='Star' style='width:30px; height:30px;'></span>\
            <span class='avgstardata'>" + PostDOM.averageStars(properties) + "</span>\
            <span class='optionicon'><img alt='options' src='/iconList/ArrowDown.png' style='width:22px; height:15px;' class='more'></span>" + 
            PostDOM.topOptionsDOMString(properties.isViewerPoster) + 
        "</div>\
        <div class='bottomdata'>\
            <div class='starrate'>\
                Total stars: <span class='stars'>" + properties.totalStars + "</span> |" + PostDOM.viewerRatingDOMString(properties.viewerRating) + 
           "</div>\
            <div class='Avgdata'>\
                <img alt='Users Amount' src='/iconList/User.png' class='UserAm'>\
                <span class='usernum'>" + properties.numOfRaters + "</span>\
            </div>\
        </div>\
    \
        <div class='contentData'>\
            <div class='postowner'>\
                <img alt='User profile photo' src='" + properties.posterImageSrc + "' class='ownerphoto'>\
                <a class='ownerfullname' href='" + properties.posterProfileLink + "'>" + properties.posterName + "</a>\
            </div>\
    \
            <div class='date'>" + properties.date + "</div>\
        </div>\
    \
        <div class='descript'>" + properties.content + "</div>\
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
    </div>");
    // todo: do this in an other way, see 'designnotes.txt' with media objects and such
    var type = properties.mediaSrc.match(/\.\w+/)[0].replace(".","");
    if(videosFileTypes.indexOf(type) !== -1) {
        this.postCon.children[0].insertBefore(Video.generateVcon(properties.mediaSrc), this.postCon.getElementsByClassName("bottomdata")[0]);
    } else {
        this.postCon.getElementsByClassName("bottomdata")[0].insertAdjacentHTML("beforebegin", 
        "<div class='Vcon'>\
            <img src='" + properties.mediaSrc + "' alt='posted image'>\
        </div>");
    }

    var commentsDOM = document.createElement("div");
    commentsDOM.classList.add("comments");
    if(comments.length > 0) {
        for (var i = 0; i < comments.length; ++i) {
            var comment  = new CommentDOM(comments[i].properties, comments[i].replies);
            commentsDOM.append(comment.commentCon);
        }
    }
    this.postCon.append(commentsDOM);
}

// consider renaming (including in commentDOM and ReplyDOM)
PostDOM.prototype.append = function() {
    document.getElementById("posts").append(this.postCon);
};

PostDOM.topOptionsDOMString = function(isViewerPoster) {
    var DOMString = 
    "<div class='topoptions'>\
        <div class='optionscon'>\
            <ul>";
    // todo: make how li works the same for two options
    if(isViewerPoster)
        DOMString += "<li class='deletepost'>delete</li>";
    else {
        DOMString += "<li><a href='#'>Report</a></li>\
                    <li><a href='#'>Feed back</a></li>";
    }
    DOMString +=
            "</ul>\
        </div>\
    </div>"
    return DOMString;
};
PostDOM.viewerRatingDOMString = function(viewerRating) {
    var DOMString = "";
    for (var i = 0; i < 5; ++i) {
        if(i < viewerRating)
            DOMString = "<img alt='star' src='/iconList/FilledStar.png' class='star'></img>";
        else
            DOMString = "<img alt='star' src='/iconList/Star.png' class='star'></img>";
    }
    return DOMString;
};
PostDOM.averageStars = function(properties) {
    if(properties.numOfRaters === '0')
        return 0;
    return (properties.totalStars/properties.numOfRaters).toFixed(1);
};