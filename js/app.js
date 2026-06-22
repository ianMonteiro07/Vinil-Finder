const API_BASE_URL = 'https://itunes.apple.com/search';
        
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const sortFilter = document.getElementById('sort-filter');
        const albumsGrid = document.getElementById('albums-grid');
        const statusMessage = document.getElementById('status-message');

        
        let currentAlbums = [];

        async function fetchAlbums(artistName) {
            try {
                albumsGrid.innerHTML = ''; 
                statusMessage.textContent = 'Procurando discos no acervo...';
                statusMessage.style.display = 'block';

                // Formatando o nome para a URL (substitui espaços por +)
                const query = encodeURIComponent(artistName);
                // entity=album (traz só álbuns/discos) e limit=50
                const response = await fetch(`${API_BASE_URL}?term=${query}&entity=album&limit=50`);

                if (!response.ok) {
                    throw new Error('Falha na conexão com a API.');
                }

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

            albums.forEach(album => {
                const card = document.createElement('div');
                card.classList.add('album-card');

                const highResImage = album.artworkUrl100.replace('100x100bb', '600x600bb');
                const releaseYear = new Date(album.releaseDate).getFullYear();
                const price = album.collectionPrice ? `$${album.collectionPrice}` : 'N/A';

                card.innerHTML = `
                    <div class="album-cover-wrapper">
                        <img src="${highResImage}" alt="Capa do álbum ${album.collectionName}" class="album-cover">
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

                albumsGrid.appendChild(card);
            });
        }
        searchBtn.addEventListener('click', () => {
            const artist = searchInput.value.trim();
            if (artist) {
                fetchAlbums(artist);
            }
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const artist = searchInput.value.trim();
                if (artist) {
                    fetchAlbums(artist);
                }
            }
        });
        sortFilter.addEventListener('change', () => {
            applySortAndRender();
        });