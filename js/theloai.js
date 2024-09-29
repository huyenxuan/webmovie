document.addEventListener('DOMContentLoaded', () => {
    const movieClass = 'col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 mb-4 p-2 col-lg-5-custom';
    const moviesPerPage = 30; // 30 phim mỗi trang của trang web

    // Lấy slug từ URL
    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }
    const slug = getSlugFromUrl();

    if (slug) {
        // Fetch movies function
        function fetchMovies(targetElement, movieClass, page) {
            let allMovies = [];  // Lưu trữ toàn bộ phim cho trang hiện tại (30 phim)
            let currentApiPage = 1;  // Trang API hiện tại đang lấy
            let totalMovies = 0;     // Tổng số phim từ API
            let totalPages = 0;      // Tổng số trang của trang web

            // Hàm tính tổng số phim và số trang dựa trên API
            const calculateTotalMoviesAndPages = () => {
                return fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=1`)
                    .then(response => response.json())
                    .then(data => {
                        totalMovies = data.paginate.total_count; // Lấy tổng số phim
                        totalPages = Math.ceil(totalMovies / moviesPerPage); // Tổng số trang trên website (dựa trên 30 phim mỗi trang)
                    });
            };

            // Hàm lấy phim từ API và ghép nhiều trang nếu cần để có đủ 30 phim cho trang hiện tại
            const fetchMoviesFromApi = (apiPage, fetchedMovies = []) => {
                return fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=${apiPage}`)
                    .then(response => response.json())
                    .then(data => {
                        const moviesFromApi = data.items;
                        fetchedMovies = [...fetchedMovies, ...moviesFromApi];

                        // Nếu chưa đủ 30 phim, tiếp tục lấy trang tiếp theo từ API
                        if (fetchedMovies.length < moviesPerPage && data.paginate.current_page < data.paginate.total_page) {
                            return fetchMoviesFromApi(apiPage + 1, fetchedMovies);
                        } else {
                            return fetchedMovies.slice(0, moviesPerPage); // Chỉ lấy 30 phim
                        }
                    });
            };

            // Bắt đầu lấy dữ liệu
            calculateTotalMoviesAndPages().then(() => {
                const startApiPage = Math.floor((page - 1) * (moviesPerPage / 10)) + 1; // Tính trang API đầu tiên cần lấy
                fetchMoviesFromApi(startApiPage).then((movies) => {
                    renderMovies(movies, targetElement, movieClass);
                    updatePagination(page, totalPages); // Cập nhật phân trang sau khi có phim
                });
            });
        }

        // Render movie function
        function renderMovies(movies, targetElement, movieClass) {
            targetElement.innerHTML = '';
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

        // Cập nhật phân trang (hiển thị số trang)
        function updatePagination(currentPage, totalPages) {
            const paginationContainer = document.getElementById('paginationNumbers');
            paginationContainer.innerHTML = ''; // Xóa nội dung cũ

            // Hiển thị tối đa 6 số trang
            const maxPageNumbersToShow = 6;
            let startPage = Math.max(currentPage - 3, 1);
            let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

            if (endPage - startPage < maxPageNumbersToShow - 1) {
                startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
            }

            // Nút ← (Trang trước)
            document.getElementById('prevPage').disabled = currentPage === 1;

            // Tạo các nút số trang
            for (let page = startPage; page <= endPage; page++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = page;
                pageButton.classList.add('page-number');
                if (page === currentPage) {
                    pageButton.classList.add('active'); // Đánh dấu trang hiện tại
                }
                pageButton.addEventListener('click', () => {
                    document.getElementById('loading').style.display = 'flex';
                    fetchMovies(movieList, movieClass, page);
                });
                paginationContainer.appendChild(pageButton);
            }

            // Nút → (Trang tiếp theo)
            document.getElementById('nextPage').disabled = currentPage >= totalPages;
        }

        // Biến lưu trữ trang hiện tại
        let currentPage = 1;
        const movieList = document.querySelector('.movie .movie-list');

        // Tải trang đầu tiên
        fetchMovies(movieList, movieClass, currentPage);

        // Xử lý khi người dùng bấm vào nút "←"
        document.getElementById('prevPage').addEventListener('click', () => {
            document.getElementById('loading').style.display = 'flex';

            if (currentPage > 1) {
                currentPage--;
                fetchMovies(movieList, movieClass, currentPage);
            }
        });

        // Xử lý khi người dùng bấm vào nút "→"
        document.getElementById('nextPage').addEventListener('click', () => {
            document.getElementById('loading').style.display = 'flex';
            currentPage++;
            fetchMovies(movieList, movieClass, currentPage);
        });
    } else {
        document.getElementById('main').textContent = 'Không tồn tại thể loại phim.';
    }
});
