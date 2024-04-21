// Fungsi untuk menampilkan detail manga saat hover
function showMangaDetails(manga, mangaItem) {
    const detailsContainer = document.querySelector('.manga-details-container');
    if (detailsContainer) {
        // Bersihkan konten sebelum menambahkan yang baru
        detailsContainer.innerHTML = '';

        // Buat elemen-elemen detail manga
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

        // Tambahkan elemen-elemen detail ke dalam container
        detailsContainer.appendChild(title);
        detailsContainer.appendChild(information);
        detailsContainer.appendChild(synopsis);

        // Mengatur posisi manga details container agar muncul di bawah manga item yang di-hover
        detailsContainer.style.top = mangaItem.offsetTop + mangaItem.offsetHeight + 'px';
        detailsContainer.style.left = mangaItem.offsetLeft + 'px';

        // Tampilkan manga details container
        detailsContainer.style.display = 'block';
    } else {
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
    }
}



// Fungsi untuk menyembunyikan detail manga saat hover berakhir
function hideMangaDetails() {
    const detailsContainer = document.getElementById('manga-details-container');
    detailsContainer.style.display = 'none'; // Sembunyikan manga details container
}

// Membaca file hasil.json
fetch('hasil.json')
    .then(response => response.json())
    .then(data => {
        const mangaList = document.getElementById('manga-list');
        const paginationContainer = document.getElementById('pagination');

        const itemsPerPage = 20;
        let currentPage = 1;

        // Function to display manga data in the selected page
        function displayManga(page) {
            mangaList.innerHTML = '';

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentManga = data.slice(startIndex, endIndex);

            currentManga.forEach(manga => {
                const row = document.createElement('tr');

                // Image column
                const imageColumn = document.createElement('td');
                const image = document.createElement('img');
                image.src = manga.image;
                image.width = 50; // Adjust the width of the image
                image.height = 70; // Adjust the height of the image
                imageColumn.appendChild(image);
                row.appendChild(imageColumn);

                // Title column
                const titleColumn = document.createElement('td');
                titleColumn.textContent = manga.title;
                row.appendChild(titleColumn);

                // Rank column
                const rankColumn = document.createElement('td');
                rankColumn.textContent = manga.rank;
                row.appendChild(rankColumn);

                // Popularity column
                const popularityColumn = document.createElement('td');
                popularityColumn.textContent = manga.popularity;
                row.appendChild(popularityColumn);

                mangaList.appendChild(row);

                // Add event listeners for hover effect
                row.addEventListener('mouseenter', () => {
                    showMangaDetails(manga, row);
                });

                row.addEventListener('mouseleave', () => {
                    hideMangaDetails();
                });
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

            const paginationWrapper = document.createElement('div');
            paginationWrapper.classList.add('pagination-wrapper');

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

             // Menambahkan teks jumlah halaman ke dalam paginationWrapper
            const pageInfo = document.createElement('div');
            pageInfo.textContent = `Page ${currentPage} of ${pageCount}`;
            paginationWrapper.appendChild(pageInfo);

            // Menambahkan paginationWrapper ke dalam paginationContainer
            paginationContainer.appendChild(paginationWrapper);
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
