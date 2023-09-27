const {
  addBookHandler, getAllBookHandler, getBookByIDHandler, editBookByIDHandler,
  deleteBookByIDHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIDHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIDHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIDHandler,
  },
];

module.exports = routes;
