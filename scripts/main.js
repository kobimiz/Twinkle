var search = document.getElementById("searchBar");

function searchVis(){
    search.style.display = "block";
    search.setAttribute("autofocus", "autofocus");
}

function closeSearch(){
    search.style.display = "none";
    search.removeAtrribute("autofocus");
}