var sidenavcover = document.getElementById("sidenavcover");
window.onclick = function (event) {
    if (event.target == sidenavcover) {
        sidenavcover.style.display = "none";
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100px";
    document.getElementById("sidenavcover").style.display = "block";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("sidenavcover").style.display = "none";
}