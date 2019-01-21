var search = document.getElementById("searchBar");

document.getElementById("searchsign").addEventListener("click", function(e) {
    search.style.display = "block";
    search.focus();
});

search.addEventListener("blur", function() {
    // check if timeout is already set. make double clicks not make searchbar go wild
    setTimeout(function() {
        search.style.display = "none";
    }, 200);
});