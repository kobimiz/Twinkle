var sidenavcover = document.getElementById("sidenavcover");
window.onclick = function (event) {
    if (event.target == sidenavcover) {
        document.getElementById("mySidenav").style.width = "0px";
        sidenavcover.style.visibility = "hidden";
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100px";
    document.getElementById("sidenavcover").style.visibility = "visible";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("sidenavcover").style.visibility = "hidden";
}