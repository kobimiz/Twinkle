var filePreview = document.getElementById("filePreview"),
    errorMessage = document.getElementById("errorMessage"),
    fileInput = document.getElementById("fileUpload"),
    progress = document.getElementById("progress"),
    filterlist = document.querySelector('.filterlist'),
    addplus = document.getElementById('adding'),
    bar = document.getElementById("bar");
var acceptetFileTypes = ["jpeg", "jpg", "png", "gif", "avi", "amv", "mp4"]; // consider adding more supported file types


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

fileInput.addEventListener("change", function () {
    var fileExtension = this.files[0].name.split('.').pop().toLowerCase();
    if (acceptetFileTypes.indexOf(fileExtension) !== -1) {
        errorMessage.style.display = "none";
        filePreview.style.display = "inline";
        reader.readAsDataURL(this.files[0]);
    }
    else {
        errorMessage.style.display = "inline";
        errorMessage.innerHTML = "File format is not supported. <a href='helpCenter/fileUploadingQA.php'>For further information please click here.</a>";
        filePreview.style.display = "none";
        filePreview.src = "";
        reader.result = null;
    }
});

document.getElementById("post").addEventListener("click", function() {
    if(reader.result !== null) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
                // consider the case where a document is returned from this.responseText
                if(this.responseText === "success")
                    errorMessage.style.display = "none";
                else if(this.responseText === "error") {
                    errorMessage.style.display = "inline";
                    errorMessage.innerHTML = "An unknown error has occured. Please try again, or contact us if the problem presists.";
                } else if(this.responseText === "invalid type") {
                    errorMessage.style.display = "inline";
                    errorMessage.innerHTML = "File format is not supported. <a href='helpCenter/fileUploadingQA.php'>For further information please click here.</a>";
                } else { // file too big
                    errorMessage.style.display = "inline";
                    errorMessage.innerHTML = "The uploaded file is too large. <a href='helpCenter/fileUploadingQA.php#largeFile'>For further information, please click here.</a>";
                }
            }
        };
        // same loading effects as "reader"-'s
        xmlhttp.onloadstart = reader.onloadstart;
        xmlhttp.onloadend = reader.onloadend;
        xmlhttp.onprogress = reader.onprogress;
    
        var formData = new FormData();
        formData.append("file", fileInput.files[0], fileInput.files[0].name);
        formData.append("content", document.getElementsByTagName("textarea")[0].value);
        xmlhttp.open("POST", "templates/uploadPost.php", true);
        xmlhttp.send(formData);
    } else {
        errorMessage.style.display = "inline";
        errorMessage.innerHTML = "No image/video? Shall we share as a note instead?";
    }
});

const links = document.querySelectorAll(".link");
const bord = document.querySelector(".bord");
bord.classList.add("bord");
// document.body.append(bord);


function bordlink(){
    const linkcoords = this.getBoundingClientRect();
    bord.style.left =  `${linkcoords.left - window.scrollX}px`;
    bord.style.top =  `${linkcoords.top - window.scrollY + document.offsetTop}px`;
    bord.style.width =  `${linkcoords.width}px`;
    bord.style.height =`${linkcoords.height}px`;
}

links.forEach(a => a.addEventListener("click", bordlink));
window.addEventListener("load",function(){
    const firstlink = links[0].getBoundingClientRect();
    bord.style.left = `${firstlink.left}px`;
    bord.style.top = `${firstlink.top}px`;
    bord.style.width = `${firstlink.width}px`;
    bord.style.height = `${firstlink.height}px`;
});

addplus.addEventListener("click",function(){
    var newItem = document.createElement("li");
    newItem.classList.add('list');
    var textnode = document.createTextNode("Water");
    newItem.appendChild(textnode);
    filterlist.insertBefore(newItem, filterlist.childNodes[`${filterlist.length - 2}`]);
});