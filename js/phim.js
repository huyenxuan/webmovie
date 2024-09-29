document.addEventListener('DOMContentLoaded', () => {
    // Hàm lấy slug từ URL
    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }
    const slug = getSlugFromUrl();

    if (slug) {
        fetch(`https://phim.nguonc.com/api/film/${slug}`)
            .then(response => response.json())
            .then(data => {
                displayMovieDetails(data.movie);
                displayEpisodes(data.movie.episodes);
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                document.querySelector('.movie-detail').innerHTML = '<p>Có lỗi xảy ra khi tải chi tiết phim.</p>';
            });
    } else {
        document.querySelector('.movie-detail').innerHTML = '<p>Không tìm thấy phim.</p>';
    }

    // Hàm hiển thị chi tiết phim trong HTML
    function displayMovieDetails(movie) {
        document.querySelector('title').textContent = movie.name;
        document.getElementById('movie-name').textContent = movie.name || 'Đang cập nhật';
        document.querySelector('.card img').src = movie.poster_url || 'Đang cập nhật';
        document.getElementById('total_episodes').textContent = movie.total_episodes + ' tập' || 'Đang cập nhật';
        document.getElementById('time').textContent = movie.time || 'Đang cập nhật';
        document.getElementById('quality').textContent = movie.quality || 'Đang cập nhật';
        document.getElementById('language').textContent = movie.language || 'Đang cập nhật';
        document.getElementById('director').textContent = movie.director || 'Đang cập nhật';
        document.getElementById('casts').textContent = movie.casts || 'Đang cập nhật';
        document.getElementById('category').textContent = movie.category['1']?.list.map(category => category.name).join(', ') || 'Đang cập nhật';
        document.getElementById('genre').textContent = movie.category['2']?.list.map(category => category.name).join(', ') || 'Đang cập nhật';
        document.getElementById('created').textContent = movie.category['3']?.list[0]?.name || 'Đang cập nhật';
        document.getElementById('country').textContent = movie.category['4']?.list[0]?.name || 'Đang cập nhật';
        document.getElementById('content-detail').textContent = movie.description;

        // Hiển thị tập 1 mặc định
        document.querySelector('iframe').src = movie.episodes[0].items[0].embed || 'Đã có lỗi. Vui lòng tải lại trang';
        document.getElementById('name-movie').textContent = `${movie.name} - Tập 1`;

        document.getElementById('loading').style.display = 'none';
    }

    // Hàm hiển thị danh sách tập phim và server
    function displayEpisodes(episodes) {
        const episodesContainer = document.getElementById('episodes');
        // Duyệt qua các server
        episodes.forEach((server) => {
            const serverTitle = document.createElement('h5');
            serverTitle.classList.add('mt-3', 'mb-0');
            serverTitle.textContent = `Server: ${server.server_name}`;
            episodesContainer.appendChild(serverTitle);

            // Duyệt qua các tập phim trong từng server
            server.items.forEach(episode => {
                const episodeElement = document.createElement('button');
                episodeElement.classList.add('p-2', 'border-none', 'bg-primary-subtle');
                episodeElement.textContent = `${episode.name}`;
                episodeElement.setAttribute('title', `Tập ${episode.name}`);

                episodeElement.addEventListener('click', () => {
                    document.getElementById('loading').style.display = 'flex';

                    const iframe = document.querySelector('iframe');
                    iframe.src = episode.embed;

                    // Cập nhật tên phim và số tập
                    const movieName = document.getElementById('movie-name').textContent;
                    document.getElementById('name-movie').textContent = `${movieName} - Tập ${episode.name}`;

                    iframe.onload = () => {
                        document.getElementById('loading').style.display = 'none';
                    };
                });
                episodesContainer.appendChild(episodeElement);
            });
        });
    }

    // Xử lý click button xem phim
    const btnWatchMovie = document.querySelector('.card button');
    const watchMovie = document.getElementById('watch-movie');
    btnWatchMovie.addEventListener('click', () => {
        watchMovie.scrollIntoView({ behavior: "smooth" });
    });
});
