const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo: {
        type: String,
        required: true,
        default: 'Nova Postagem'
    },
    conteudo: {
        type: String,
        required: true,
        default: 'Conteúdo padrão'
    },
    slug: {
        type: String,
        required: true,
        default:'Novo Slug'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categoria',
        required: true
    }
})

mongoose.model('postagem' , Postagem);