// Fungsi untuk menampilkan detail manga saat hover
function showMangaDetails(manga, mangaItem) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('manga-details-container');

    const title = document.createElement('div');
    title.classList.add('manga-item-title');
    title.textContent = manga.title;

    const information = document.createElement('div');
    information.classList.add('manga-item-information');
    manga.information.forEach(info => {
        const p = document.createElement('p');
        p.textContent = info.trim();
        information.appendChild(p);
    });

    const synopsis = document.createElement('div');
    synopsis.classList.add('manga-item-synopsis');
    synopsis.textContent = manga.synopsis;

    detailsContainer.appendChild(title);
    detailsContainer.appendChild(information);
    detailsContainer.appendChild(synopsis);

    mangaItem.appendChild(detailsContainer);

    // Menambahkan event listener untuk menyembunyikan detail saat kursor meninggalkan
    mangaItem.addEventListener('mouseleave', () => {
        hideMangaDetails(mangaItem);
    });

    // Menambahkan event listener untuk menyembunyikan detail saat kursor meninggalkan detail itu sendiri
    detailsContainer.addEventListener('mouseleave', (event) => {
        // Menggunakan contains untuk memeriksa apakah event.relatedTarget adalah bagian dari mangaItem
        if (!mangaItem.contains(event.relatedTarget)) {
            hideMangaDetails(mangaItem);
        }
    });
}

// Fungsi untuk menyembunyikan detail manga saat hover berakhir
function hideMangaDetails(mangaItem) {
    const detailsContainer = mangaItem.querySelector('.manga-details-container');
    if (detailsContainer) {
        mangaItem.removeChild(detailsContainer);
    }
}

// Membaca file hasil.json
fetch('hasil.json')
    .then(response => response.json())
    .then(data => {
        const mangaList = document.getElementById('manga-list');
        const paginationContainer = document.getElementById('pagination');

        const itemsPerPage = 20;
        let currentPage = 1;

        // Fungsi untuk menampilkan data di halaman yang dipilih
        function displayManga(page) {
            mangaList.innerHTML = '';

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentManga = data.slice(startIndex, endIndex);

            currentManga.forEach(manga => {
                const mangaItem = document.createElement('div');
                mangaItem.classList.add('manga-item');

                // Menambahkan gambar
                const image = document.createElement('img');
                image.src = manga.image;
                mangaItem.appendChild(image);

                // Menambahkan detail manga
                const details = document.createElement('div');
                details.classList.add('manga-item-details');

                const title = document.createElement('div');
                title.classList.add('manga-item-title');
                title.textContent = manga.title;
                details.appendChild(title);

                mangaItem.appendChild(details);

                // Menambahkan event listener untuk menampilkan detail saat hover
                mangaItem.addEventListener('mouseover', () => {
                    showMangaDetails(manga, mangaItem);
                });

                // Menambahkan event listener untuk menyembunyikan detail saat hover berakhir
                mangaItem.addEventListener('mouseleave', () => {
                    hideMangaDetails(mangaItem);
                });

                // Menambahkan item manga ke dalam list
                mangaList.appendChild(mangaItem);
            });
        }

        // Fungsi untuk membuat tombol pagination
        function createPaginationButtons() {
            const pageCount = Math.ceil(data.length / itemsPerPage);
            const maxPage = Math.min(10, pageCount);

            let startPage, endPage;

            // Menetapkan halaman pertama dan terakhir
            if (pageCount <= 10 || currentPage <= 7) {
                startPage = 1;
                endPage = Math.min(10, pageCount);
            } else if (currentPage + 4 >= pageCount) {
                startPage = pageCount - 9;
                endPage = pageCount;
            } else {
                startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
                endPage = Math.min(startPage + 9, pageCount);
            }

            const firstButton = document.createElement('button');
            firstButton.textContent = 'First';
            firstButton.addEventListener('click', () => {
                currentPage = 1;
                displayManga(currentPage);
                updatePagination();
            });
            paginationContainer.appendChild(firstButton);

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Prev';
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayManga(currentPage);
                    updatePagination();
                }
            });
            paginationContainer.appendChild(prevButton);

            // Adding button for tens only once
            if (startPage > 10) {
                const tensButton = document.createElement('button');
                tensButton.textContent = startPage - 10;
                tensButton.addEventListener('click', () => {
                    currentPage = startPage - 10;
                    displayManga(currentPage);
                    updatePagination();
                });
                paginationContainer.appendChild(tensButton);
            }

            for (let i = startPage; i <= endPage; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                if (i === currentPage) {
                    button.classList.add('active');
                }
                button.addEventListener('click', () => {
                    currentPage = i;
                    displayManga(currentPage);
                    updatePagination();
                });
                paginationContainer.appendChild(button);
            }

            // Adding button for tens only once
            if (endPage < pageCount && endPage % 10 !== 0) {
                const tensButton = document.createElement('button');
                tensButton.textContent = Math.ceil(endPage / 10) * 10;
                tensButton.addEventListener('click', () => {
                    currentPage = Math.ceil(endPage / 10) * 10;
                    displayManga(currentPage);
                    updatePagination();
                });
                paginationContainer.appendChild(tensButton);
            }

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                if (currentPage < pageCount) {
                    currentPage++;
                    displayManga(currentPage);
                    updatePagination();
                }
            });
            paginationContainer.appendChild(nextButton);


            const lastButton = document.createElement('button');
            lastButton.textContent = 'Last';
            lastButton.addEventListener('click', () => {
                currentPage = pageCount;
                displayManga(currentPage);
                updatePagination();
            });
            paginationContainer.appendChild(lastButton);
        }


        // Fungsi untuk memperbarui tampilan pagination saat navigasi dilakukan
        function updatePagination() {
            paginationContainer.innerHTML = '';
            createPaginationButtons();
        }

        // Menampilkan data pada halaman pertama dan membuat pagination
        displayManga(currentPage);
        createPaginationButtons();
    })
    .catch(error => console.error('Error:', error));