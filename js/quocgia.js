document.addEventListener('DOMContentLoaded', () => {
    const movieClass = 'col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 mb-4 p-2 col-lg-5-custom';
    const moviesPerPage = 30; // Số phim muốn hiển thị mỗi trang
    const apiMoviesPerPage = 10; // Số phim API trả về mỗi trang
    let currentPage = 1;
    let totalPage = 1;

    // Lấy slug từ URL
    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }
    const slug = getSlugFromUrl();

    if (slug) {
        // Hàm fetch phim
        function fetchMovies(targetElement, movieClass, page = 1) {
            currentPage = page;
            const requiredApiPages = Math.ceil(moviesPerPage / apiMoviesPerPage); // Số trang API cần fetch để đủ 30 phim

            let promises = [];
            for (let i = 1; i <= requiredApiPages; i++) {
                const apiPage = (page - 1) * requiredApiPages + i; // Tính trang API cần gọi
                promises.push(fetch(`https://phim.nguonc.com/api/films/quoc-gia/${slug}?page=${apiPage}`));
            }

            // Fetch tất cả các trang API cần thiết
            Promise.all(promises)
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(dataArray => {
                    let allMovies = [];
                    dataArray.forEach(data => {
                        allMovies = [...allMovies, ...data.items]; // Gộp tất cả các phim từ các trang API
                    });

                    totalPage = Math.ceil(dataArray[0].paginate.total_items / moviesPerPage); // Tính tổng số trang ảo
                    renderMovies(allMovies.slice(0, moviesPerPage), targetElement, movieClass); // Hiển thị 30 phim
                    renderPagination(totalPage, currentPage);
                    document.querySelector('title').textContent = 'Phim ' + dataArray[0].cat.title;
                    document.querySelector('.movie .title h3').textContent = 'Danh sách phim ' + dataArray[0].cat.title;
                })
                .catch(error => {
                    console.error('Error fetching movies:', error);
                    targetElement.innerHTML = '<p>Có lỗi xảy ra khi tải phim.</p>';
                });
        }

        // Hàm render phim
        function renderMovies(movies, targetElement, movieClass) {
            targetElement.innerHTML = ''; // Xóa các phim hiện tại
            movies.forEach(item => {
                const movieCard = document.createElement('div');
                movieCard.classList.add(...movieClass.split(' '));
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

        // Hàm render pagination
        function renderPagination(totalPage, currentPage) {
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = ''; // Clear existing pagination

            let startPage = Math.max(1, currentPage - 2); // Bắt đầu từ trang hiện tại - 2
            let endPage = Math.min(totalPage, currentPage + 2); // Kết thúc tại trang hiện tại + 2

            if (endPage - startPage < 4) {
                if (currentPage <= 3) {
                    endPage = Math.min(5, totalPage);
                } else if (currentPage >= totalPage - 2) {
                    startPage = Math.max(1, totalPage - 4);
                }
            }

            // Thêm nút "Previous" nếu không phải là trang đầu tiên
            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.classList.add('pagination-btn');
                prevButton.onclick = function () {
                    document.getElementById('loading').style.display = 'flex';
                    fetchMovies(movieList, movieClass, currentPage - 1);
                };
                paginationContainer.appendChild(prevButton);
            }

            // Thêm các nút số trang
            for (let i = startPage; i <= endPage; i++) {
                const paginationButton = document.createElement('button');
                paginationButton.textContent = i;
                paginationButton.classList.add('pagination-btn');
                paginationButton.onclick = function () {
                    document.getElementById('loading').style.display = 'flex';
                    fetchMovies(movieList, movieClass, i);
                };

                if (i === currentPage) {
                    paginationButton.classList.add('active');
                }

                paginationContainer.appendChild(paginationButton);
            }

            // Thêm nút "Next" nếu không phải là trang cuối cùng
            if (currentPage < totalPage) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.classList.add('pagination-btn');
                nextButton.onclick = function () {
                    document.getElementById('loading').style.display = 'flex';
                    fetchMovies(movieList, movieClass, currentPage + 1);
                };
                paginationContainer.appendChild(nextButton);
            }
        }

        const movieList = document.querySelector('.movie .movie-list');
        fetchMovies(movieList, movieClass);

    } else {
        document.getElementById('main').textContent = 'Không tồn tại thể loại phim.';
    }
});
