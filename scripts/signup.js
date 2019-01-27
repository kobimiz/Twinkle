var Wshowpass = document.getElementById("Wshowpass");
var Wpass = document.getElementById("choosepass");


function WshowPass() {
    Wshowpass.style.display = "block";
    if (Wpass.value == "") {
        Wshowpass.style.display = "none";
    }
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

document.body.addEventListener("load", function() { document.register.email.focus(); });

