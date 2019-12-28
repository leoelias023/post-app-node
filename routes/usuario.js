// Requiring dependencies
    const express = require('express');
    const router = express.Router();
    const mongoose = require('mongoose');
        // Requiring model usuario
            require('../models/Usuario');
            const Usuario = mongoose.model('usuario');
    // Crypt model
        const bcrypt = require('bcryptjs');

// Routes of user
    router.get('/' , (req,res) => {
        res.send('Não tem nada aqui. Saia!');
    })
    router.get('/cadastro' , (req,res) => {
        res.render('main/cadastro' , {layout: 'clear'});
    })
    router.post('/cadastro/new' , (req,res) => {
        const User = {
            nome: req.body.nome_user,
            sobrenome: req.body.sobrenome_user,
            login: req.body.login_user,
            senha: req.body.senha_user,
            confirma: req.body.confirma_user
        }
        // Validations
            var erros = [];
            // Empty Fields
                // Nome
                    if(!User.nome || typeof User.nome == null || typeof User.nome == undefined)
                    {
                        erros.push({text: 'O campo nome não pode estar vazio. Preencha-o'});
                    }

                // Sobrenome
                    if(!User.sobrenome || typeof User.sobrenome == null || typeof User.sobrenome == undefined)
                    {
                        erros.push({text: 'O campo sobrenome não pode estar vazio. Preencha-o'});
                    }

                // Login
                    if(!User.login || typeof User.login == null || typeof User.login == undefined)
                    {
                        erros.push({text: 'O campo LOGIN não pode estar vazio. Preencha-o'});
                    }

                // Senha
                    if(!User.senha || typeof User.senha == null || typeof User.senha == undefined)
                    {
                        erros.push({text: 'O campo SENHA não pode estar vazio. Preencha-o'});
                    }

                // Confirm Senha 
                    if(!User.confirma || typeof User.confirma == null || typeof User.confirma == undefined)
                    {
                        erros.push({text: 'O campo de confirmação não pode estar vazio. Preencha-o'});
                    }


            // if password equal confirm-password
                if(User.senha != User.confirma)
                {
                    erros.push({text: 'Sua senha não confere com a confirmação.'});
                }
                
            // Verifing if has error's
                if(erros.length > 0)
                {
                    res.render('main/cadastro' , {erros: erros , layout: 'clear'});
                }
                else{
                    bcrypt.genSalt(10 , (erro, salt) => {
                        bcrypt.hash(User.senha , salt , (err , hash) => {
                            if(err)
                            {
                                req.flash('error_msg' , 'Erro interno na criptografia.');
                                res.redirect('/');
                            }
                            else{
                                User.senha = hash;
    
                                const novoUsuario = new Usuario(User);
                                novoUsuario.save().then( () => {
                                    req.flash('success_msg' , 'Usuario cadastrado');
                                    res.redirect('/');
                                }).catch( () => {
                                    req.flash('error_msg' , 'Erro ao cadastrar novo usuario');
                                    res.redirect('/');
                                })
                            }
                        })
                    })
                }
    })

// Exporting the router for app.js
    module.exports = router;