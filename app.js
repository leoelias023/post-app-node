// Initials configurations
    var PORT = 80;
// Requiring modules
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');
    const handlebars = require('express-handlebars');
    const mongoose = require('mongoose');
    const flash = require('connect-flash');
    const session = require('express-session');
// Requiring passport
    const passport = require('passport');
    require('./config/auth')(passport);
// Requering the panel
    const painel = require('./routes/painel.js')
    // Models
        // Posts
            require('./models/Postagem');
            const Postagem = mongoose.model('postagem');
        // User
            require('./models/Usuario');
            const Usuario = mongoose.model('usuario');
// Requiring the user
    const usuario = require('./routes/usuario');

// Global configurations
    // Static archives
        app.use(express.static(__dirname + '/public'));

    // Handlebars
        app.engine('handlebars' , handlebars({mainLayout: 'main'}));
        app.set('view engine' , 'handlebars');

    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    // Mongoose
        mongoose.connect('mongodb://localhost/postapp' , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then( () => {
            console.log('   #  DB: CONNECTED                           #');
            console.log('   #                                          #');
            console.log('   ############################################\n');
        }).catch( (err) => {
            console.log('   #  DB: NOT CONNECTED                       #');
            console.log('   #                                          #');
            console.log('   ############################################\n');
        })
    // Session and Flash
        app.use(session({
            secret: '102030',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash())
        // Middleware [TRATAMENTO DE EXCEÇÕES]
            app.use( (req,res,next) => {
                res.locals.success_msg = req.flash('success_msg');
                res.locals.error_msg = req.flash('error_msg');
                res.locals.error = req.flash('error');
                res.locals.user = req.user || null;
                next();
            })

// Global Routes
    // Main route
        app.get('/' , (req,res) => {
            Postagem.find().then( (postagem) => {
                res.render('main/postagens' , {postagens: postagem});
            })
        })
    // Routes of index
        app.get('/postagens/:ordem' , (req,res) => {
            Postagem.find().sort({date: req.params.ordem}).then( (postagem) => {
                res.render('main/postagens' , {postagens: postagem});
            })
        })
    // Group of routes 
        // [PAINEL ADMIN]
            app.use('/painel' , painel);
        // [USER ROUTE]
            app.use('/usuario' , usuario);

    // Routes of login
        app.get('/login' , (req,res) => {
            res.render('main/login' , {layout: 'clear'});
        })
        app.post('/login/auth' , (req,res,next) => {
            // Validation
                var erros = [];
                if(!req.body.name_user || typeof req.body.name_user == null || typeof req.body.name_user == undefined)
                {
                    erros.push({text: 'O campo usuario deve ser preenchido'});
                }
                if(!req.body.senha_user || typeof req.body.senha_user == null || typeof req.body.senha_user == undefined)
                {
                    erros.push({text: 'O campo senha deve ser preenchido'});
                }
                
            // Verifing if has error's
                if(erros.length > 0)
                {
                    res.render('main/login' , {erros: erros , layout: 'clear'});
                }
                else{
                    passport.authenticate('local' , {
                        successRedirect: '/',
                        failureRedirect: '/login',
                        failureFlash: true
                    })(req,res,next)
                }
        })
        // Logout
            app.get('/logout' , (req,res) => {
                req.logout();
                req.flash('success_msg' , 'Logout efetuado');
                res.redirect('/');
            })

// Listen Server informations
    app.listen(PORT , () => {
        console.log('\n   ############################################')
        console.log('   #          SERVER OPENED: POSTAPP          #');
        console.log('   #                                          #');
        console.log('   #  PORT: '+PORT+'                                #');
        console.log('   #  PROCESS: app.js'+'                         #');
    });