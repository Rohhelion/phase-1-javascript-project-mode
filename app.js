// app.js

const apiKey = '&bibkeys=OLID:OL123M';

function searchBooks(event) {
  event.preventDefault();

  const searchQuery = document.getElementById('search-input').value;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displaySearchResults(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function displaySearchResults(data) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';

  if (data.totalItems === 0) {
    resultsContainer.innerHTML = 'No results found.';
    return;
  }

  data.items.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');

    const title = book.volumeInfo.title;
    const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';

    bookItem.innerHTML = `
      <img src="${book.volumeInfo.imageLinks?.thumbnail || 'no-image.jpg'}" alt="Book Cover">
      <h3>${title}</h3>
      <p>By: ${authors}</p>
      <button class="details-button" data-id="${book.id}">View Details</button>
      <div class="book-details" style="display: none;"></div>
    `;

    resultsContainer.appendChild(bookItem);
  });

  attachDetailsEventListeners();
}

function attachDetailsEventListeners() {
  const detailsButtons = document.querySelectorAll('.details-button');
  detailsButtons.forEach(button => {
    button.addEventListener('click', () => {
      const bookId = button.dataset.id;
      const bookDetailsContainer = button.parentNode.querySelector('.book-details');
      getBookDetails(bookId, bookDetailsContainer);
    });
  });
}

function getBookDetails(bookId, bookDetailsContainer) {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayBookDetails(data, bookDetailsContainer);
    })
    .catch(error => {
      console.log(error);
    });
}

function displayBookDetails(book, bookDetailsContainer) {
  const title = book.volumeInfo.title;
  const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
  const description = book.volumeInfo.description || 'No description available.';
  const publicationDate = book.volumeInfo.publishedDate || 'Unknown';

  bookDetailsContainer.innerHTML = `
    <h3>${title}</h3>
    <p>By: ${authors}</p>
    <p>Published: ${publicationDate}</p>
    <p>${description}</p>
    <button class="add-to-reading-list" data-id="${book.id}">Add to Reading List</button>
  `;

  const addToReadingListButtons = document.querySelectorAll('.add-to-reading-list');
  addToReadingListButtons.forEach(button => {
    button.addEventListener('click', () => {
      const bookId = button.dataset.id;
      addToReadingList(bookId);
    });
  });

  // Toggle book details visibility on click
  bookDetailsContainer.style.display = bookDetailsContainer.style.display === 'none' ? 'block' : 'none';
}

function addToReadingList(bookId) {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const readingListItems = document.getElementById('reading-list-items');
      const listItem = document.createElement('li');
      listItem.textContent = data.volumeInfo.title;
      readingListItems.appendChild(listItem);
    })
    .catch(error => {
      console.log(error);
    });
}

document.getElementById('search-form').addEventListener('submit', searchBooks);
