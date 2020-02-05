function ReplyDOM(properties) {
    this.replyDOM = document.createElement("div");
    this.replyDOM.classList.add("replydiv");
    this.replyDOM.insertAdjacentHTML("afterbegin",
    "<div class='userD'>\
        <a href='" + properties.replierProfileLink + "' class='userN'>\
            <img alt='Profile photo' src='" + properties.replierImageSrc + "' class='selfimg'>" + properties.replierName + "</a>\
        <span class='commdate'>" + properties.date + "</span>\
    </div>\
    <div class='replycont'>" + properties.content + "</div>" + 
    ReplyDOM.comsetDOMString(properties.isViewerReplier)
    );
}

ReplyDOM.comsetDOMString = function(isViewerReplier) {
    var DOMString =
    "<div class='comset'>\
        <span class='comnote'>note</span>";
    if(isViewerReplier) {
        DOMString += 
        "<span class='comdelete'>delete</span>";
    }
    DOMString +=
    "</div>";
    return DOMString;
}