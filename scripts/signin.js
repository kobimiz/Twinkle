var showpass = document.getElementById("showpass"),
    pass = document.getElementById("password"),
    Wshowpass = document.getElementById("Wshowpass"),
    Wpass = document.getElementById("choosepass");

function showPass() {
    showpass.style.display = "block";
    if (pass.value == "")
        showpass.style.display = "none";
}

function changepass() {
    if (showpass.src.search(/slash/g) == -1) {
        showpass.src = "iconList/eye-slash-solid.svg";
        pass.type = "text";
    } else {
        showpass.src = "iconList/eye-solid.svg";
        pass.type = "password";
    }
    pass.addEventListener("blur", function () {
        pass.type = "password";
        showpass.src = "iconList/eye-solid.svg";
    });
}

function WshowPass() {
    Wshowpass.style.display = "block";
    if (Wpass.value == "")
        Wshowpass.style.display = "none";
}

function Wchangepass() {
    if (Wshowpass.src.search(/slash/g) == -1) {
        Wshowpass.src = "iconList/eye-slash-solid.svg";
        Wpass.type = "text";
    } else {
        Wshowpass.src = "iconList/eye-solid.svg";
        Wpass.type = "password";
    }
    Wpass.addEventListener("blur", function () {
        Wpass.type = "password";
        Wshowpass.src = "iconList/eye-solid.svg";
    });
}

document.body.addEventListener("load", document.login.username.focus());
var input = document.getElementById("username");
      var targ = document.getElementById("letternum");
      var container = document.getElementById("count");
    
    function change(){
     targ.innerHTML = input.value.length;
     
     if(input.value.length == 0){
         container.style.display = "none";
     }else{
         container.style.display ="inline-block"
	 }
    };
