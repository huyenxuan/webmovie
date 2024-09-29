document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();
    const newMovieClass = 'col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 mb-4 p-2 col-lg-5-custom';
    const cateMovieClass = 'col-6 col-sm-4 col-md-4 col-lg-3 col-xl-3 mb-4 p-2';
    const maxMovies = 12;

    function fetchNewMovies(apiUrl, targetElement, movieClass) {
        let allMovies = [];
        let currentPage = 1;

        // Hàm để fetch từng trang và lấy phim
        const fetchMoviesByPage = (page) => {
            fetch(`${apiUrl}&page=${page}`)
                .then(response => response.json())
                .then(data => {
                    allMovies = [...allMovies, ...data.items];
                    if (allMovies.length >= maxMovies) {
                        renderMovies(allMovies.slice(0, maxMovies), targetElement, movieClass);
                    } else if (data.paginate && currentPage < data.paginate.total_page) {
                        currentPage++;
                        fetchMoviesByPage(currentPage);
                    } else {
                        renderMovies(allMovies, targetElement, movieClass);
                    }
                })
                .catch(error => {
                    console.error('Error fetching movies:', error);
                    targetElement.innerHTML = '<p>Có lỗi xảy ra khi tải phim.</p>';
                });
        };
        fetchMoviesByPage(currentPage);
    }

    // Hàm để render phim ra HTML
    function renderMovies(movies, targetElement, movieClass) {
        targetElement.innerHTML = '';
        movies.forEach(item => {
            const movieCard = document.createElement('div');
            movieCard.classList.add(...movieClass.split(' ')); // Sử dụng class tương ứng
            movieCard.innerHTML = `
                <a href="chitiet.html?slug=${item.slug}" title="${item.name}">
                    <div class="card position-relative">
                        <img src="${item.poster_url}" class="card-img-top movie-img" alt="${item.name}" loading="lazy">
                        <div class="card-body p-2 w-100">
                            <h5 class="card-title fs-6 text-light movie-name">${item.name}</h5>
                        </div>
                        <div class="status position-absolute p-1">${item.language}</div>
                    </div>
                </a>`;
            targetElement.appendChild(movieCard);
        });
        document.getElementById('loading').style.display = 'none';
    }

    // Gọi hàm cho các danh mục phim khác nhau
    const newMovieList = document.querySelector('.new-movie .movie-list');
    fetchNewMovies(`https://phim.nguonc.com/api/films/phim-moi-cap-nhat?cache_bust=${timestamp}`, newMovieList, newMovieClass);

    const phimBoList = document.querySelector('.phimBo .movie-list');
    fetchNewMovies(`https://phim.nguonc.com/api/films/danh-sach/phim-bo?cache_bust=${timestamp}`, phimBoList, cateMovieClass);

    const phimLeList = document.querySelector('.phimLe .movie-list');
    fetchNewMovies(`https://phim.nguonc.com/api/films/danh-sach/phim-le?cache_bust=${timestamp}`, phimLeList, cateMovieClass);

    const phimHoatHinhList = document.querySelector('.phimHoatHinh .movie-list');
    fetchNewMovies(`https://phim.nguonc.com/api/films/danh-sach/hoat-hinh?cache_bust=${timestamp}`, phimHoatHinhList, cateMovieClass);
});