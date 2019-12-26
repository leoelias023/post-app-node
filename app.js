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
// Requering the panel
        const painel = require('./routes/painel.js')

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
            console.log('\nThe bank of data is connected');
        }).catch( (err) => {
            console.log('\nThe bank is not working, error: '+ err);
        })
    // Session and Flash
        app.use(session({
            secret: '102030',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
        // Middleware [TRATAMENTO DE EXCEÇÕES]
            app.use( (req,res,next) => {
                res.locals.success_msg = req.flash('success_msg');
                res.locals.error_msg = req.flash('error_msg');
                next();
            })

// Global Routes
    // Main route
        app.get('/' , (req,res) => {
            res.render('home');
        })
    // Group of routes [PAINEL ADMIN]
        app.use('/painel' , painel);

// Listen Server informations
    app.listen(PORT , () => {
        console.log('############################################')
        console.log('#          SERVER OPENED: POSTAPP          #');
        console.log('#                                          #');
        console.log('#  PORT: '+PORT+'                                #');
        console.log('#  PROCESS: app.js'+'                         #')
        console.log('#                                          #');
        console.log('############################################');
    });