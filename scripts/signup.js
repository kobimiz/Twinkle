var Wshowpass = document.getElementById("Wshowpass"),
    Wpass = document.getElementById("choosepass"),
    input = document.getElementById("choosename"),
    targ = document.getElementById("letternum"),
    container = document.getElementById("count");

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
}

function change() {
    targ.innerHTML = input.value.length;

    if (input.value.length == 0)
        container.style.display = "none";
    else
        container.style.display = "inline-block"
}

Wpass.addEventListener("blur", function () {
    Wpass.type = "password";
    Wshowpass.src = "iconList/eye-solid.svg";
});

document.body.addEventListener("load", function () {
    document.register.email.focus();
});
