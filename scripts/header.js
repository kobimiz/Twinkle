var displayDis = document.querySelectorAll("#navi>ul>li");
var searchInp = document.getElementById("searchBar");
var prevYScroll = window.pageYOffset;
var searchIcon = document.querySelector(".searchIcon");
var sidenavbutton = document.getElementById("sidenavbutton");


//Event listeners
window.addEventListener("scroll", function(){
    var currentYScroll = window.pageYOffset;
    
    if(prevYScroll < currentYScroll){
        document.getElementById("navi").style.padding = "5px 40px";
        document.getElementById("navi").style.height = "45px";
        document.querySelector(".usericon").style.visibility = "hidden";
        document.querySelector(".usericon").style.opacity = "0";
        document.querySelector(".notifi").style.visibility = "hidden";
        document.querySelector(".notifi").style.opacity = "0";
        document.querySelector(".navnote").style.visibility = "hidden";
        document.querySelector(".navnote").style.opacity = "0";
        document.querySelector("#sidenavbutton").style.fontSize = "27px";
        document.querySelector(".Logofont").style.display = "none";
        document.querySelector(".imgfont").style.marginRight = "110px";
    }else{
        document.getElementById("navi").style.padding = "10px 40px";
        document.getElementById("navi").style.height = "60px";
        document.querySelector(".usericon").style.visibility = "visible";
        document.querySelector(".usericon").style.opacity = "1";
        document.querySelector(".notifi").style.visibility = "visible";
        document.querySelector(".notifi").style.opacity = "1";
        document.querySelector(".navnote").style.visibility = "visible";
        document.querySelector(".navnote").style.opacity = "1";
        document.querySelector("#sidenavbutton").style.fontSize = "30px";
        document.querySelector(".Logofont").style.display = "";
        document.querySelector(".imgfont").style.marginRight = "0";
    }

    prevYScroll = currentYScroll;
});
searchIcon.addEventListener("touchstart", function(){
    // var Inplength = window.innerWidth - searchIcon.width - sidenavbutton.clientWidth + "px";

    if(displayDis[1].style.display == ""){
        for(var i=1; i < displayDis.length; i++){
            displayDis[i].setAttribute("style", "display: none !important;");
        }
        // searchInp.setAttribute("style", "display: block; max-width: 350px;");
        searchInp.style.display = "block";
        searchInp.style.maxWidth = "35px"
        setTimeout(function(){searchInp.style.maxWidth = "350px", 100});
        document.querySelector("#navi>ul").setAttribute("style", "display: inline-flex");
    }else{
        for(var i=0; i < displayDis.length; i++){
            displayDis[i].removeAttribute("style");
        }
        searchInp.setAttribute("style", "display: none;");
        document.querySelector("#navi>ul").setAttribute("style", "display: flex;");
        searchInp.setAttribute("style", "max-width: 350px");
    }
});
