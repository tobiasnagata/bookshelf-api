const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const parsedYear = Number(year);
  const parsedPageCount = Number(pageCount);
  const parsedReadPage = Number(readPage);
  const parsedReading = Boolean(reading);

  const newBook = {
    id,
    name,
    year: parsedYear,
    author,
    summary,
    publisher,
    pageCount: parsedPageCount,
    readPage: parsedReadPage,
    finished,
    reading: parsedReading,
    insertedAt,
    updatedAt,
  };

  // Handle error
  const isNameEmpty = name === undefined || name === '';
  const outOfPage = parsedReadPage > parsedPageCount;

  if (isNameEmpty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (outOfPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Success
  books.push(newBook);

  const isBookAdded = books.filter((book) => book.id === id).length > 0;

  if (isBookAdded) {
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

  // Unknown error
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (Boolean(name) || Boolean(reading) || Boolean(finished)) {
    const filteredBooks = books.filter(
      (book) => (name
        ? book.name.toLowerCase().includes(name?.toLowerCase())
        : true)
        && (reading ? book.reading === !!Number(reading) : true)
        && (finished ? book.finished === !!Number(finished) : true),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map(({ id, name: bookName, publisher }) => ({
          id,
          name: bookName,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map(({ id, name: bookName, publisher }) => ({
        id,
        name: bookName,
        publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByID = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((bk) => bk.id === bookId)[0];

  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookByID = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const parsedYear = Number(year);
  const parsedPageCount = Number(pageCount);
  const parsedReadPage = Number(readPage);
  const parsedReading = Boolean(reading);

  const updatedAt = new Date().toISOString();

  // Handle error
  const isNameEmpty = name === undefined || name === '';
  const outOfPage = parsedReadPage > parsedPageCount;

  if (isNameEmpty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (outOfPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Handle success
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year: parsedYear,
      author,
      summary,
      publisher,
      pageCount: parsedPageCount,
      readPage: parsedReadPage,
      reading: parsedReading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: books[index],
    });
    response.code(200);
    return response;
  }

  // Unknown error
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
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
  addBook,
  getBooks,
  getBookByID,
  updateBookByID,
  deleteBook,
};
