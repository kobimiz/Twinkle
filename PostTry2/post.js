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
var optionsarrow = document.querySelector(".optionicon");
var optionscon = document.querySelector(".optionscon");
var screensize = document.querySelector(".screenicon");
var volume = document.querySelector(".volumeicon");
var volumecheck = false;
var clickcheck_ = false;
var comform = document.querySelector('.comform');
var checkcom = false;
var checkrep = false;
var act = document.querySelector('.act1');
var reply = document.querySelector(".comreply");
var repform = document.querySelector(".replyform");


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

btn.onclick = function () {
    FPP();
}
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

videojump.addEventListener("mousedown", function (e) {
    isDown = true;
    startX = e.pageX - videojump.offsetLeft;
    scrolLeft = videojump.scrollLeft;
    if (video.play) {
        btn.classList.add("play");
        btn.classList.remove("pause");
        video.pause();
    }
});

videojump.addEventListener("mouseleave", function () {
    isDown = false;
});

videojump.addEventListener("mouseup", function () {
    isDown = false;
    if (video.paused) {
        btn.classList.add("pause");
        btn.classList.remove("play");
        video.play();
    } else {
        btn.classList.add("play");
        btn.classList.remove("pause");
        video.pause();
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
        volume.src = "Volumeon.png";
        volume.style.width = "22px";
        volume.style.height = "20px";
        video.muted = true;
        volumecheck = true;

    }else{
        volume.src = "Volumeoff.png";
        volume.style.width = "30px";
        volume.style.height = "35px";
        video.muted = false;
        volumecheck = false;
    }
});

/*<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>*/
//<<<<<<<>>>>>>>>
video.addEventListener("click", function () {
    if (video.paused) {
        pauseanime.classList.add("pauseanimeadd");
        setTimeout(RemoveClass_, 1000);
    } else if (video.play) {
        playanime.classList.add("playanimeadd");
        setTimeout(RemoveClass, 1000);
    }
});
function RemoveClass() {
    playanime.classList.remove("playanimeadd");
}
function RemoveClass_() {
    pauseanime.classList.remove("pauseanimeadd");
}
/*<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>*/

// show and hide of the options nav bar
optionsarrow.addEventListener("click",function(e){
    if(!clickcheck_){
        optionscon.style.display = "block";
        clickcheck_ = true;
        e.stopPropagation();
    }else{
        optionscon.style.display = "none";
        clickcheck_ = false;
    }
});
document.body.addEventListener('click',function(){
    if(clickcheck_ == true){
        optionscon.style.display = "none";
        clickcheck_ = false;
    }
});
optionscon.addEventListener("click",function(e){
    e.stopPropagation();
});


/*stars animation --------------------- */

function getChildNum(element) {
    var siblings = element.parentElement.children;
    for(var i = 0; i < siblings.length; i++)
        if(siblings[i] === element)
            return i;
    return -1;
}


function rate(e) {
    if (e.target.matches("img")) {
        var childNum = getChildNum(e.target),
            siblings = e.target.parentElement.children,
            xmlhttp = new XMLHttpRequest(),
            formData = new FormData();
        if(siblings[childNum].src.indexOf("FilledStar.png") !== -1 && (!siblings[childNum + 1] || siblings[childNum + 1].src.indexOf("Star.png") !== -1)) { // pressed again on same star - cancel
            formData.append("stars", 0);
            for(var i = 0; i < 5; i++) 
                siblings[i].src = "Star.png";
        } else {
            var i = 0;
            for(; i <= childNum; i++)
                siblings[i].src = "FilledStar.png";
            for(; i < 5; i++)
                siblings[i].src = "Star.png";
            formData.append("stars", i + 1);
        }
        // xmlhttp.open("POST", "templates/uploadPost.php", true);
        // xmlhttp.send(formData);
    }
}

document.getElementsByClassName("starrate")[0].addEventListener("click", rate);

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
act.addEventListener("click",function(e){
    if(!checkcom){
        comform.style.display = "block";
        checkcom = true;
        e.stopPropagation();
    }else{
        comform.style.display = "none";
        checkcom = false;
    }
});
document.body.addEventListener('click',function(){
    if(checkcom == true){
        comform.style.display = "none";
        checkcom = false;
    }
});
comform.addEventListener("click",function(e){
    e.stopPropagation();
});

//reply click anime
reply.addEventListener("click",function(e){
    if(!checkrep){
        repform.style.display = "block";
        checkrep = true;
        e.stopPropagation();
    }else{
        repform.style.display = "none";
        checkrep = false;
    }
});
document.body.addEventListener('click',function(){
    if(checkrep == true){
        repform.style.display = "none";
        checkrep = false;
    }
});
repform.addEventListener("click",function(e){
    e.stopPropagation();
});
