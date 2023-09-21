const {
  addBook,
  getBooks,
  getBookByID,
  updateBookByID,
  deleteBook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByID,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookByID,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },
];

module.exports = routes;
