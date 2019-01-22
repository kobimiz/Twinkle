var search = document.getElementById("searchBar"),
    searchbarDisplayed = false;

document.getElementById("searchsign").addEventListener("click", function() {
    if(!searchbarDisplayed) {
        search.style.display = "block";
        search.focus();
        search.select();
        searchbarDisplayed = true;
    }
});

search.addEventListener("blur", function() {
    if(searchbarDisplayed) {
        setTimeout(function() {
            search.style.display = "none";
            searchbarDisplayed = false;
        }, 200);
    }
});