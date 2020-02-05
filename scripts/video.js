// consider making my own event system- one that takes advantage of multiple elements that have the same function for events (same events or consider even other)
// todo: add video pause on leaving the screen on scroll\playing another video
// consider rethiking bind function idea (efficiancy wise)
// todo: add keyboard arrow navigation in video (forward, backward etc)
var BarsDir = true;
var activeVideo = null;
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
    // todo: remove all mousemove listeners in mobile mode (and possibly more redundant listeners)
    if(!mobcheck)
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

Video.prototype.togglePlayBtn = function(e) {
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
Video.prototype.HitStartVideo = function(e) {
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
Video.prototype.togglePlayMbl = function(e) {
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
Video.prototype.removePauseAnimeAdd = function(e) {
    this.pauseanime.classList.remove("pauseanimeadd");
};
Video.prototype.removePlayAnimeAdd = function(e) {
    this.playanime.classList.remove("playanimeadd");
};
Video.prototype.timeUpdate = function (e) {
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
Video.prototype.manageBars = function(e) {
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
Video.prototype.hideBars = function(e) {
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
Video.prototype.forward = function(e) {
    this.video.currentTime += 5;
};
Video.prototype.backward = function(e) {
    this.video.currentTime -= 5;
};
Video.prototype.jumpTime = function(e)       {
    this.video.currentTime = (e.offsetX / this.videoJump.offsetWidth) * this.video.duration;
};
Video.prototype.raiseMouse = function(e) {
    this.mousedown = false;
};
Video.prototype.mouseDown = function(e)       { // consider renaming (confusion w this.mousedown)
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
Video.prototype.mouseUp = function (e) {
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
Video.prototype.mouseMove = function (e)       {
    if (!this.isDown) return;
    e.preventDefault();
    var pos = e.pageX - this.videoJump.offsetLeft; // mouse position on X axis
    this.juiceBar.style.width = e.offsetX + "px";
    this.video.currentTime = (e.offsetX / this.videoJump.offsetWidth) * this.video.duration;
};
Video.prototype.toggleVolume = function(e) {
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
Video.prototype.videoEnd = function(e) {
    this.btn.classList.add("play");
    this.btn.classList.remove("pause");
}
//this is a test
Video.prototype.clickFullScreen = function(e) {
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
Video.prototype.toggleFullScreen = function(e) {
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

Video.generateVcon = function(fileUploaded) {
    var vcon = document.createElement("div");
    vcon.classList.add("Vcon");
    vcon.insertAdjacentHTML("afterbegin",
    "<div class='topbar'>\
        <div class='juicecon'>\
            <div class='TimeCount'> <span class='curtime'>0:00</span> <span>/</span> <span class='durtime'></span></div>\
            <div class='linediv'>\
                <div class='juicebar'></div>\
                <div class='juicemark'></div>\
                <div class='videojump'></div>\
            </div>\
        </div>\
    </div>\
    <video class='video' src='"+ fileUploaded +"#t=0.1' alt='Posted video'>\
        Your browser do not support videos. You may want to consider upgrading it.\
    </video>\
    <div class='playanime'></div>\
    <div class='pauseanime'></div>\
    <div class='bottombar'>\
        <div class='left'>&#x276E;</div>\
        <div class='extracon'>\
            <div class='volume'> <img alt='volume' src='/iconList/Volumeon.png' class='volumeicon'> <span class='volumeoff'></span> </div>\
            <div class='fullscreen'><img alt='volume' src='/iconList/bigger.png' class='screenicon'> </div>\
        </div>\
        <div class='control'>\
            <button class='play-pause'></button>\
        </div>\
        <div class='right'>&#x276F;</div>\
    </div>");
    return vcon;
};
