const { nanoid } = require('nanoid');
const books = require('./books');
const name = require('function.prototype.name/implementation');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;
    if(pageCount === readPage) {
        finished = true;
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };
    
    
    
    if(!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
        
    }
    else{
        
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        books.push(newBook);
        return response;
}

};

const getAllBooksHandler = () => ({
    status:'success',
    data: {
        books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
    },
    
});

const getBookByIdHandler = (request, h) =>{
    const { bookId } = request.params;
    const book = books.filter((book) => book.id === bookId)[0];

    if (book !== undefined){
        return {
            status:'success',
            data: {
                book,
            },
        }
    }
    else {

        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',  
        });

        response.code(404);
        return response;
    }
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);
    
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response; 
    }

    if (index !== -1) { //if index is anithing but -1, it means it has been successfully updated
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
            status:'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }


    else{
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status:'success',
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
    getAllBooksHandler, 
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};