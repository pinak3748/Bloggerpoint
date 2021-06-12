// Express
const express = require('express')
const app = new express()


// connection
app.use(express.static('public'))
// app.listen(4000, (error) => {
//     if(error) return handleError(error);
//     else return console.log("App listening on port 4000");
// })

let port = process.env.PORT;
if (port == null || port == "") {
port = 4000;
}
app.listen(port, ()=>{
console.log('App listening...')
})

// Templating module
const ejs = require('ejs')
app.set('view engine','ejs')


// Middleware decoding module
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


// Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true, useUnifiedTopology: true});


// Multimedia file
const fileUpload = require('express-fileupload')
app.use(fileUpload())


// express session
const expressSession = require('express-session');
app.use(expressSession({ 
    secret: 'Matrix',
    resave: true,
    saveUninitialized: true,
}))

// to change login to logout

global.loggedin = null;

app.use("*", (req,res,next) => {
    loggedin = req.session.userId;
    next()
});
    
// Validation
const validateMiddleware = require("./middleware/validationMiddleware");

// delecting session error variable after sucessful submittion
const flash = require('connect-flash');
app.use(flash());

// Routing

    //homepage 
    const homeController = require('./controllers/home')
        app.get('/',homeController)

    // about page
    app.get('/about',(req,res)=>{
        res.render('about');
    })

    // contact page
    app.get('/contact',(req,res)=>{
        res.render('contact');
    })

    // display post 
        const getPostController = require('./controllers/getPost')
        app.get('/post/:id',getPostController)

        // new post create
        const newPostController = require('./controllers/newPost')
        app.get('/posts/new',newPostController)

        // redirecting for non-login user through middleware
        const authMiddleware = require('./middleware/authMiddleware');
        app.get('/posts/new',authMiddleware, newPostController)

            // post validation
            app.use('/posts/store',validateMiddleware)

            // store post
            const storePostController = require('./controllers/storePost')
            app.post('/posts/store',authMiddleware,storePostController)
          
    // check if user is login or not
    const redirect_if_login = require('./middleware/redirect_if_login')

    //new user    
    const newUserController = require('./controllers/newUser')           
    app.get('/auth/register', redirect_if_login , newUserController)
            
    // store user
    const storeUserController = require('./controllers/storeUser')
    app.post('/user/register', redirect_if_login ,storeUserController)

    //user login
    const loginController = require('./controllers/login')
    app.get('/auth/login', redirect_if_login , loginController);

    // login validation
    const loginUserController = require('./controllers/loginUser')
    app.post('/users/login', redirect_if_login ,loginUserController)

    // logout
    const logoutController = require('./controllers/logout')
    app.get('/auth/logout', logoutController)


    // password-reset
    const checkuser = require('./controllers/checkuser')
    app.get('/reset/check_user',checkuser)

    // send email  
    const email_gen = require('./controllers/email_gen')
    app.post('/reset/check_user', email_gen)


    const reset_password = require('./controllers/reset_password')
    app.get('/reset/password/:id',reset_password)

    
    const store_new_password = require('./controllers/store_new_password')
    app.post('/reset/password/:id', store_new_password)

    

    // page not found
    app.use((req,res) => res.render('notfound'))