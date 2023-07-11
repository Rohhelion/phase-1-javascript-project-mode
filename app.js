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
      getBookDetails(bookId);
    });
  });
}

function getBookDetails(bookId) {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayBookDetails(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function displayBookDetails(book) {
  const detailsContainer = document.getElementById('book-details');

  const title = book.volumeInfo.title;
  const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
  const description = book.volumeInfo.description || 'No description available.';
  const publicationDate = book.volumeInfo.publishedDate || 'Unknown';

  detailsContainer.innerHTML = `
    <h3>${title}</h3>
    <p>By: ${authors}</p>
    <p>Published: ${publicationDate}</p>
    <p>${description}</p>
    <button id="add-to-reading-list" data-id="${book.id}">Add to Reading List</button>
  `;

  const addToReadingListButton = document.getElementById('add-to-reading-list');
  addToReadingListButton.addEventListener('click', () => {
    addToReadingList(book);
  });
}

function addToReadingList(book) {
  const readingListItems = document.getElementById('reading-list-items');
  const listItem = document.createElement('li');
  listItem.textContent = book.volumeInfo.title;
  readingListItems.appendChild(listItem);
}

document.getElementById('search-form').addEventListener('submit', searchBooks);
