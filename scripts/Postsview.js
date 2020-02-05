var modalstar = document.querySelector(".Viewer");

//Event Listeners
window.addEventListener("mousedown",function(e){
	if(e.target == modalstar){
		modalstar.style.display = "none";
		document.getElementsByTagName("main")[0].classList.remove("set-blur");
	}
});