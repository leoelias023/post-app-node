const express = require('express');
const router = express.Router();

// Mongoose
    const mongoose = require('mongoose');
    // Requiring category
        require('../models/Categoria');
        const Categoria = mongoose.model('categoria');

// Main Route of painel
    router.get('/' , (req,res) => {
        res.render('painel/home' , {layout: 'dashboard'});
    });

// Route of categories
    router.get('/categoria' , (req,res) => {
        res.render('painel/categoria' , {layout: 'dashboard'});
    })
    // Add a new category
        router.get('/categoria/cadastrar' , (req,res) => {
            res.render('painel/cadastrar-categoria' , {layout: 'dashboard'});
        })
        router.post('/categoria/cadastrar/new' , (req,res) => {
            // Validation of form [EM CRIACAO!!]
                let name = req.body.nome_categoria;
                let slug = req.body.slug_categoria;
                var erros = [];
                // Empty fields
                    if(!name || typeof name == null || typeof name == undefined)
                    {
                        erros.push({text: 'O campo nome não pode estar vazio'});
                    }
                    if(!slug || typeof slug == null || typeof slug == undefined)
                    {
                        erros.push({text: 'O campo slug não pode estar vazio'});
                    }
                // Spaces in slug
                    if(slug.indexOf(' ') > 0){
                        erros.push({text: 'O campo slug não pode conter espaços'});
                    }
                       
            // Verifing if have erros
                if(erros.length > 0)
                {
                    res.render('painel/cadastrar-categoria' , {erros: erros , layout: 'dashboard'});
                }
                else{
                    const newCategoria = {
                        name: name,
                        slug: slug
                    }
                    new Categoria(newCategoria).save().then( () => {
                        req.flash('success_msg' , 'Categoria criada com sucesso!');
                        res.redirect('/painel/categoria');
                    }).catch( (err) => {
                        console.log(err);
                    })
                    }
        })
module.exports = router;