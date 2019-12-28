module.exports = {
    eAdmin: (req,res,next) => {
        if(req.isAuthenticated() && req.user.group == 1)
        {
            return next();
        }
        req.flash('error_msg' , 'Your permission has been denied , Log in.. Please!');
        res.redirect('/');
    }
}