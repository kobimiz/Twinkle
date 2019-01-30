var video = document.querySelector(".video");
var btn = document.getElementById("play-pause");
var leftBtn = document.getElementById("left");
var rightBtn = document.getElementById("right");


function FPP(){
    if(video.paused){
        btn.className = "pause";
        video.play();
    }else{
        btn.className = "play";
        video.pause();
    }
}

btn.onclick = function(){
    FPP();
}
video.onclick = function(){
    if(video.paused){
        btn.className = "pause";
        video.play();
    }else{
        btn.className = "play";
        video.pause();
    }
}

leftBtn.onclick = function(){
    video.currentTime += -5;
}
rightBtn.onclick = function(){
    video.currentTime += +5;
}