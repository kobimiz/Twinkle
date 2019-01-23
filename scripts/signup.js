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
        Wshowpass.src = "/eye-slash-solid.svg";
        Wpass.type = "text";
    } else {
        Wshowpass.src = "/eye-solid.svg";
        Wpass.type = "password";
    }
    Wpass.addEventListener("blur", function () {
        Wpass.type = "password";
        Wshowpass.src = "/eye-solid.svg";
    });
}