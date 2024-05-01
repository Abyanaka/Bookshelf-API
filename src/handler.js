const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Note added successfully',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Failed to add note',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status:'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) =>{
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined){
        return {
            status:'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Note not found',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) { //if index is anithing but -1, it means it has successfully updated
        notes[index] = {
           ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status:'success',
            message: 'Note updated successfully',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Note not found',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if (index!== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status:'success',
            message: 'Note deleted successfully',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Note not found',
    });
    response.code(404);
    return response;

};

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};