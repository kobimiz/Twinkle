var modalstar = document.querySelector(".Viewer");
var Avgdata = document.querySelectorAll(".Avgdata");

//Functions
for(var i = 0; i < Avgdata.length; i++){
    (function(index){
        Avgdata[index].addEventListener("click",function(){
			modalstar.style.display = "block";
			document.getElementsByTagName("main")[0].classList.add("set-blur");
        });
    })(i);
}

//Event Listeners
window.addEventListener("mousedown",function(e){
	if(e.target == modalstar){
		modalstar.style.display = "none";
		document.getElementsByTagName("main")[0].classList.remove("set-blur");
	}
});