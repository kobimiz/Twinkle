var modalstar = document.querySelector(".Viewer");

//Functions
function Poper(){
	modalstar.style.display = "block";
	document.getElementsByTagName("main")[0].classList.add("set-blur");
}
//Event Listeners
window.addEventListener("mousedown",function(e){
	if(e.target == modalstar){
		modalstar.style.display = "none";
		document.getElementsByTagName("main")[0].classList.remove("set-blur");
	}
});