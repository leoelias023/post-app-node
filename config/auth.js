const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
    // Model [USUARIO]
        require('../models/Usuario');
        const Usuario = mongoose.model('usuario');
const bcrypt = require('bcryptjs');




module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'name_user' , passwordField: 'senha_user'} , (login,senha,done) => {
        Usuario.findOne({login: login}).then( (usuario) => {
            if(!usuario)
            {
                return done(null, false , {message: 'Úsuario inexistente no sistema'});
            }
            else
            {
                bcrypt.compare(senha , usuario.senha , (err, bateu) => {
                    if(bateu)
                    {
                        return done(null, usuario);
                    }
                    else{
                        return done(null,false,{message: 'Senha incorreta'});
                    }
                })
            }
        })
    }))

    passport.serializeUser( (usuario, done) => {
        done(null, usuario.id);
    })

    passport.deserializeUser( (id,done) => {
        Usuario.findById(id , (err , usuario) => {
            done(err,usuario);
        })
    })
}