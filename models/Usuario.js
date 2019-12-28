const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String
    },
    login: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    group: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
});


mongoose.model('usuario' , Usuario);