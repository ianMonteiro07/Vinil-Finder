const API_BASE_URL = 'https://itunes.apple.com/search';
        
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const sortFilter = document.getElementById('sort-filter');
const albumsGrid = document.getElementById('albums-grid');
const statusMessage = document.getElementById('status-message');

let currentAlbums = [];

function getFavorites() {
    const saved = localStorage.getItem('vinil_favorites');
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('vinil_favorites', JSON.stringify(favorites));
}

function toggleFavorite(album, btnElement) {
    let favorites = getFavorites();
    const index = favorites.findIndex(fav => fav.collectionId === album.collectionId);

    if (index === -1) {
        favorites.push(album);
        btnElement.textContent = '💚';
        btnElement.classList.add('active');
    } else {
        favorites.splice(index, 1);
        btnElement.textContent = '🤍';
        btnElement.classList.remove('active');
    }

    saveFavorites(favorites);
}

async function fetchAlbums(artistName) {
    try {
        albumsGrid.innerHTML = ''; 
        statusMessage.textContent = 'Procurando discos no acervo...';
        statusMessage.style.display = 'block';

        const query = encodeURIComponent(artistName);
        const response = await fetch(`${API_BASE_URL}?term=${query}&entity=album&limit=50`);

        if (!response.ok) throw new Error('Falha na conexão com a API.');

        const data = await response.json();

        if (data.results.length === 0) {
            statusMessage.textContent = 'Nenhum disco encontrado para este artista.';
            currentAlbums = [];
            return;
        }

        currentAlbums = data.results;
        statusMessage.style.display = 'none';
        
        applySortAndRender();

    } catch (error) {
        console.error('Erro na requisição:', error);
        statusMessage.textContent = 'Erro ao conectar com o acervo musical. Tente novamente.';
    }
}

function applySortAndRender() {
    if (currentAlbums.length === 0) return;

    const sortValue = sortFilter.value;
    let sortedAlbums = [...currentAlbums];

    if (sortValue === 'date-new') {
        sortedAlbums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortValue === 'date-old') {
        sortedAlbums.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else if (sortValue === 'price-low') {
        sortedAlbums.sort((a, b) => {
            const priceA = a.collectionPrice || 0;
            const priceB = b.collectionPrice || 0;
            return priceA - priceB;
        });
    }

    renderAlbums(sortedAlbums);
}

function renderAlbums(albums) {
    albumsGrid.innerHTML = '';
    
    const favorites = getFavorites();

    albums.forEach(album => {
        const card = document.createElement('div');
        card.classList.add('album-card');

        const highResImage = album.artworkUrl100.replace('100x100bb', '600x600bb');
        const releaseYear = new Date(album.releaseDate).getFullYear();
        const price = album.collectionPrice ? `$${album.collectionPrice}` : 'N/A';

        const isFavorite = favorites.some(fav => fav.collectionId === album.collectionId);
        const heartIcon = isFavorite ? '💚' : '🤍';
        const activeClass = isFavorite ? 'active' : '';

        card.innerHTML = `
            <div class="album-cover-wrapper">
                <img src="${highResImage}" alt="Capa do álbum ${album.collectionName}" class="album-cover">
                <button class="favorite-btn ${activeClass}" title="Favoritar álbum">
                    ${heartIcon}
                </button>
            </div>
            <div class="album-info">
                <div class="album-title" title="${album.collectionName}">${album.collectionName}</div>
                <div class="album-artist">${album.artistName}</div>
                <div class="album-meta">
                    <span>${releaseYear} • ${album.primaryGenreName}</span>
                    <span class="album-price">${price}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.open(album.collectionViewUrl, '_blank');
        });

        const favBtn = card.querySelector('.favorite-btn');
        favBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavorite(album, favBtn);
        });

        albumsGrid.appendChild(card);
    });
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const handleSearch = debounce((event) => {
    const artist = event.target.value.trim();
    if (artist.length > 2) {
        fetchAlbums(artist);
    } else if (artist.length === 0) {
        albumsGrid.innerHTML = '';
        statusMessage.textContent = 'Digite o nome de um artista para explorar seu acervo musical.';
        statusMessage.style.display = 'block';
        currentAlbums = [];
    }
}, 500);

searchInput.addEventListener('input', handleSearch);

searchBtn.addEventListener('click', () => {
    const artist = searchInput.value.trim();
    if (artist.length > 2) fetchAlbums(artist);
});

favoritesBtn.addEventListener('click', () => {
    const favs = getFavorites();
    searchInput.value = '';
    
    if (favs.length === 0) {
        albumsGrid.innerHTML = '';
        statusMessage.textContent = 'Você ainda não tem nenhum álbum favoritado. Busque um artista e clique no coração!';
        statusMessage.style.display = 'block';
        currentAlbums = [];
        return;
    }

    statusMessage.style.display = 'none';
    currentAlbums = favs;
    applySortAndRender();
});

sortFilter.addEventListener('change', () => {
    applySortAndRender();
});