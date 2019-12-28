const express = require('express');
const router = express.Router();

// Mongoose
    const mongoose = require('mongoose');
    // Requiring category
        require('../models/Categoria');
        const Categoria = mongoose.model('categoria');
    // Requiring post
        require('../models/Postagem');
        const Postagem = mongoose.model('postagem');
    // Requiring user
        require('../models/Usuario');
        const Usuario = mongoose.model('usuario');
        // Authenticate
            const {eAdmin} = require('../helpers/eAdmin');

// Main Route of painel
    router.get('/' , eAdmin, (req,res) => {
        res.render('painel/home' , {layout: 'dashboard'});
    });

// Route of categories
    router.get('/categoria' , eAdmin, (req,res) => {
        Categoria.find().sort({date: -1}).then( (categoria) => {
            res.render('painel/categoria/categoria' , {layout: 'dashboard' , categoria: categoria}); 
        }).catch( (err) => {
            req.flash('error_msg' , 'Houve um erro ao listar categorias!');
            res.redirect('painel/categoria');
        });
    })
    // Add a new category
        router.get('/categoria/cadastrar' , eAdmin, (req,res) => {
            res.render('painel/categoria/cadastrar-categoria' , {layout: 'dashboard'});
        })
        router.post('/categoria/cadastrar/new' , eAdmin, (req,res) => {
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
                    res.render('painel/categoria/cadastrar-categoria' , {erros: erros , layout: 'dashboard'});
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

        router.get('/categoria/excluir/:id' , eAdmin, (req,res) => {
            idEscolhido = req.params.id;
            Categoria.deleteOne({_id: idEscolhido}).then( () => {
                req.flash('success_msg' , 'Categoria excluida!');
                res.redirect('/painel/categoria');
            }).catch( (err) => {
                req.flash('error_msg' , 'Ocorreu um erro ao deletar a categoria');
                res.redirect('/painel/categoria');
            })
        })

        router.get('/categoria/editar/:id' , eAdmin, (req,res) => {
            idEscolhido = req.params.id;
            Categoria.findOne({_id: idEscolhido}).then( (categoria) => {
                res.render('painel/categoria/editar-categoria' , {categoria: categoria , layout: 'dashboard'})
            }).catch( (err) => {
                req.flash('error_msg' , 'Categoria não encontrada');
                req.redirect('painel/categoria');
            })
        })

        router.post('/categoria/editar/editing' , eAdmin, (req,res) => {
            let name =  req.body.nome_categoria;
            let slug = req.body.slug_categoria;
            
            // Tratando possiveis exções
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
            // Verifing if have error's
                if(erros.length > 0)
                {
                    for(x=0; x<erros.length; x++)
                    {
                        req.flash('error_msg' , erros[x].text);
                    }
                    res.redirect('/painel/categoria');
                }
                else{
                    Categoria.updateOne({_id: req.body.id_categoria} , {name: name , slug: slug}).then( () => {
                        req.flash('success_msg' , 'The category has been update!');
                        res.redirect('/painel/categoria')
                    }).catch( (err) => {
                        req.flash('error_msg' , 'Not possible edit the category!');
                        res.redirect('painel/categoria');
                    })
                }
        })

// Route of POSTS
    // Main route of posts
        router.get('/postagem' , eAdmin, (req,res) => {
            Postagem.find().populate('categoria').then( (postagem) => {
                res.render('painel/postagem/postagem' , {layout: 'dashboard' , postagem: postagem})
            }).catch( (err) => {
                req.flash('error_msg' , 'Erro ao carregar posts');
                res.render('painel/postagem/postagem' , {layout: 'dashboard'})
            })
        })
        router.get('/postagem/cadastrar' , eAdmin, (req,res) => {
            Categoria.find().then( (categoria) => {
                res.render('painel/postagem/cadastrar-postagem' , {layout: 'dashboard' , categoria: categoria});
            }).catch( (err) => {
                res.render('painel/postagem/cadastrar-postagem' , {layout: 'dashboard'})
            })
        })
        router.post('/postagem/cadastrar/new' , eAdmin, (req,res) => {
            // Validation
                var erros = [];
                let titulo = req.body.titulo_post;
                let conteudo = req.body.conteudo_post;
                let slug = req.body.slug_post;
                let categoria = req.body.categoria_post;

                // Empty fields
                    if(!titulo || typeof titulo == null || typeof titulo == undefined)
                    {
                        erros.push({text: 'O campo título não pode estar vazio.'});
                    }
                    if(!conteudo || typeof conteudo == null || typeof conteudo == undefined)
                    {
                        erros.push({text: 'O campo conteúdo não pode estar vazio.'});
                    }
                    if(!slug || typeof slug == null || typeof slug == undefined)
                    {
                        erros.push({text: 'O campo slug não pode estar vazio.'});
                    }
                    if(!categoria || typeof categoria == null || typeof categoria == undefined)
                    {
                        erros.push({text: 'O campo categoria deve ser preenchido!'});
                    }
                // Min length
                    if(titulo.length < 3 || conteudo.length < 3)
                    {
                        erros.push({text: 'O título ou conteúdo deve conter pelo menos 3 caracteres'});
                    }
                // Verifing if have error's
                    if(erros.length > 0)
                    {
                        res.render('painel/postagem/cadastrar-postagem' , {layout: 'dashboard', erros: erros});
                    }
                    else{
                        const newPostagem = {
                            titulo: titulo,
                            conteudo: conteudo,
                            slug: slug,
                            categoria: categoria
                        }
                        new Postagem(newPostagem).save().then( () => {
                            req.flash('success_msg' , 'Postagem criada com sucesso!');
                            res.redirect('/painel/postagem');
                        }).catch( (err) => {
                            req.flash('error_msg' , 'Erro ao criar uma nova postagem: ' + err);
                            res.redirect('/painel/postagem');
                        })
                    }
        })

        router.get('/postagem/excluir/:id' , eAdmin, (req,res) => {
            Postagem.deleteOne({_id: req.params.id}).then( () => {
                req.flash('success_msg' , 'Postagem excluida');
                res.redirect('/painel/postagem');
            }).catch( (err) => {
                req.flash('error_msg' , 'Erro ao excluir postagem: '+ err);
                res.redirect('/painel/postagem');
            })
        })

module.exports = router;