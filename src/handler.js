/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
// eslint-disable-next-line no-unused-vars

const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    id,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Server error',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name: qName, reading, finished } = request.query;

  let datas = books;

  if (qName) {
    datas = datas.filter((x) => x.name && x.name.toLowerCase().includes(qName.toLowerCase()));
  }
  if (reading) {
    datas = datas.filter((x) => x.reading === Boolean(Number(reading)));
  }
  if (finished) {
    datas = datas.filter((x) => x.finished === Boolean(Number(finished)));
  }

  return h.response({
    status: 'success',
    data: {
      books: datas.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  }).code(200);
};
//   let { name, reading, finished } = request.query;

//   if (!name && reading === undefined && finished === undefined) {
//     if (books.length === 0) {
//       const response = h.response({
//         status: 'success',
//         data: {
//           books: [],
//         },
//       });
//       response.code(200);
//       return response;
//     }

//     const response = h.response({
//       status: 'success',
//       data: {
//         books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
//       },
//     });
//     response.code(200);
//     return response;
//   }

//   let filteredBooks = [...books];

//   if (name) {
//     filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase()
//       .includes(name.toLowerCase()));
//   }

//   if (reading === '0' || reading === '1') {
//     const isReading = reading === '1';
//     filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
//   }

//   if (finished === '0' || finished === '1') {
//     const isFinished = finished === '1';
//     filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
//   }

//   if (filteredBooks.length === 0) {
//     const response = h.response({
//       status: 'fail',
//       message: 'Buku tidak ditemukan',
//     });
//     response.code(404);
//     return response;
//   }

//   const response = h.response({
//     status: 'success',
//     data: {
//       books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
//     },
//   });
//   response.code(200);
//   return response;
// };

const getBookByIDHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIDHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Server error',
  });
  response.code(500);
  return response;
};

const deleteBookByIDHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIDHandler,
  editBookByIDHandler,
  deleteBookByIDHandler,
};
