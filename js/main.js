function searchMovie() {
    event.preventDefault();
    var searchInput = document.getElementById('inputSearch');
    var keyword = searchInput.value;
    window.location.href = `timkiem.html?slug=${keyword}`;
}