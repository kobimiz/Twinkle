var texter = document.querySelector(".texter > textarea");
var modal = document.querySelector(".Popcon");
var Taginp = document.querySelector("input[name='filter']");
var drop = document.querySelector(".drop");
var filterchoice = document.querySelector(".filterchoice");
var markup = document.querySelectorAll(".markup");
var dropli = document.querySelectorAll(".drop>ul>li");
var sortselect = document.querySelector(".watchsort>select");
var myul = document.getElementById("myul");
var inputsort = document.querySelector(".inputsort");
var searchlist = document.querySelector(".searchlist");
var dlt = document.getElementById("delete");
var Taglist = document.querySelector(".Tagdisplay>ul");



//Functions
var autoExpand = function(field) {
	// reset the textarea height
	field.style.height = 'inherit';
	
	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);
	
	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	+ parseInt(computed.getPropertyValue('padding-top'), 10)
	+ field.scrollHeight
	+ parseInt(computed.getPropertyValue('padding-bottom'), 10)
	+ parseInt(computed.getPropertyValue('border-bottom-width'), 10);
	
	field.style.height = height - 20 + 'px';
};

function Postpop(){
	modal.style.display = "block";
	texter.focus();
	document.getElementsByTagName("main")[0].classList.add("set-blur");
}
function Tagdown(){
	if(Taginp.value.length > 0){
		drop.style.display = "block";
	}else if(Taginp.value == ""){
		drop.style.display = "none";
	}
}
function Tagup(e){
	if(e.target != filterchoice){
		drop.style.display = "none";
	}
}
function Tagcheck(){
	if(Taginp.value.length > 0 || Taginp.value != ""){
		drop.style.display = "block";
	}else{
		drop.style.display = 'none';
	}
}
function setC(x){
	if(x.lastChild.className != "markup selected" || x.lastChild.className == "markup"){
		x.lastChild.classList.add("selected");
	}else if(x.lastChild.className == "markup selected"){
		x.lastChild.classList.remove("selected");
	}
}
function uptoLoad(){
	document.querySelector(".upload").click();
}

function selectChange(){
	if(sortselect.value == "Private"){
		inputsort.style.display = "block";
		myul.style.display = "block";
	}else{
		inputsort.style.display = "none";
		myul.style.display = "none";
	}
}
function listSort(){
	if(inputsort.value != ""){
		searchlist.style.display = "block";
	}
	var filter = inputsort.value.toUpperCase(),
	ul= document.getElementById("myul"), 
	li = ul.getElementsByTagName("li"), a, i, txtValue;
		for(i = 0; i < li.length; i++){
		a = li[i].getElementsByTagName("a")[0];
	   txtValue = a.textContent || a.innerHTML;
		   if(txtValue.toUpperCase().indexOf(filter)> -1)
		   {
			   li[i].style.display = "";
			}else{
				li[i].style.display = "none"
			}
	}
}


//Event Listeners
document.addEventListener('input', function(e) {
	if (e.target.tagName.toLowerCase() !== 'textarea') return;
	autoExpand(e.target);
}, false);
window.addEventListener("mousedown",function(e){
	if(e.target == modal){
		modal.style.display = "none";
		document.getElementsByTagName("main")[0].classList.remove("set-blur");
	}
});
// dlt.addEventListener("click",function(){
// 	onclick the Tag should be deleted
// });

filterchoice.addEventListener("input",Tagdown);
filterchoice.addEventListener("blur",Tagup);
Taginp.addEventListener("focus",Tagcheck);
sortselect.addEventListener("change",selectChange)
inputsort.addEventListener("input", listSort);
// /^[a-zA-Z0-9]*$/ this is regex for letters and number, add with php a request for when user submit a tag and make a new element with the value
//accoding to the template in the html file