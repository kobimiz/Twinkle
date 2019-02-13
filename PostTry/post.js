var video = document.querySelector(".video");
var btn = document.getElementById("play-pause");
var leftBtn = document.getElementById("left");
var rightBtn = document.getElementById("right");
var juiceBar = document.querySelector(".juicebar");
var juiceMark = document.querySelector(".juicemark");
var videojump = document.querySelector('.videojump');
var linediv = document.getElementById("linediv");
var durTIme = document.getElementById("durtime");
var curTIme = document.getElementById("curtime");
var playanime = document.querySelector(".playanime");
var pauseanime = document.querySelector(".pauseanime");
var topbar = document.querySelector(".topbar");
var bottombar = document.querySelector(".bottombar");
var optionsarrow = document.querySelector(".optionicon");
var optionscon = document.querySelector(".optionscon");
var clickcheck_ = false;

function FPP() {
    if (video.paused) {
        btn.className = "pause";
        video.play();
    } else {
        btn.className = "play";
        video.pause();
    }
}

btn.onclick = function () {
    FPP();
}
video.onclick = function () {
    if (video.paused) {
        btn.className = "pause";
        video.play();
    } else {
        btn.className = "play";
        video.pause();
    }
}
video.ontimeupdate = function () {
    if (video.ended) {
        btn.className = "play";
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
        btn.className = "play";
        video.pause();
    }
});

videojump.addEventListener("mouseleave", function () {
    isDown = false;
});

videojump.addEventListener("mouseup", function () {
    isDown = false;
    if (video.paused) {
        btn.className = "pause";
        video.play();
    } else {
        btn.className = "play";
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
optionsarrow.addEventListener("click",function(){
    if(!clickcheck_){
        optionscon.style.display = "block";
        clickcheck_ = true;
    }else{
        optionscon.style.display = "none";
        clickcheck_ = false;
    }
});

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
        if(siblings[childNum].src.indexOf("Fulledstar.png") !== -1 && (!siblings[childNum + 1] || siblings[childNum + 1].src.indexOf("Firststar.png") !== -1)) { // pressed again on same star - cancel
            formData.append("stars", 0);
            for(var i = 0; i < 5; i++) 
                siblings[i].src = "/PostTry/Firststar.png";
        } else {
            var i = 0;
            for(; i <= childNum; i++)
                siblings[i].src = "/PostTry/Fulledstar.png";
            for(; i < 5; i++)
                siblings[i].src = "/PostTry/Firststar.png";
            formData.append("stars", i + 1);
        }
        // xmlhttp.open("POST", "templates/uploadPost.php", true);
        // xmlhttp.send(formData);
    }
}

document.getElementsByClassName("starrate")[0].addEventListener("click", rate);