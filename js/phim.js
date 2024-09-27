document.addEventListener('DOMContentLoaded', () => {
    // Hàm lấy slug từ URL
    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    const slug = getSlugFromUrl(); // Lấy slug từ URL

    if (slug) {
        // Gọi API để lấy chi tiết phim dựa trên slug
        fetch(`https://phim.nguonc.com/api/film/${slug}`)
            .then(response => response.json())
            .then(data => {
                displayMovieDetails(data.movie);
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
        document.querySelector('iframe').src = movie.episodes[0].items[0].embed || 'Đã có lỗi. Vui lòng tải lại trang';

        document.getElementById('loading').style.display = 'none';
    }
});