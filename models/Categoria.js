const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categoria = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Nova categoria'
    },
    slug: {
        type: String,
        required: true,
        default: 'Novo Slug'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categoria' , Categoria);