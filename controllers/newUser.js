module.exports = (req, res) =>{
    var username = ""
    var password = ""
    var email = ""
    const data = req.flash('data')[0];
   
        if(typeof data != "undefined"){
            username = data.username
            password = data.password
            email = data.email
    }
        res.render('register',{
            errors: req.flash('validationErrors'),
            username: username,
            password: password,
            email: email,
    })
    }