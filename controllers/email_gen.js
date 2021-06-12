require('dotenv').config();
const user = require('../models/User')
const Token = require('../models/token');
const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')

module.exports = (req, res) => {
    let user_email = req.body.email;
    console.log(user_email);

    user.findOne({email: user_email}).then((result)=>{

        if(result) {

        
            // Email generate
            async function main() {

            let transporter = nodemailer.createTransport({
            service: "gmail",
            // secure: false,
                auth: {
                    type: 'OAuth2',
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                    clientId: process.env.OAUTH_CLIENTID,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN
                },
            }); 

            var mailGenerator = new Mailgen({
                theme: 'default',
                product: {
                    // Appears in header & footer of e-mails
                    name: 'Blog',
                    link: 'http://127.0.0.1:4000/',
                    // Optional product logo
                    // logo: 'http://127.0.0.1:4000/img/post-bg.jpg',
                    // logoHeight: '30px'
                }
            });

            // ?token=${resetToken}&id=${user._id};
            var email = {
                body: {
                    name: result.username,
                    intro: "It seems like that you don't remember your password",
                    action: {
                        instructions: 'Please click the button to reset password',
                        button: {
                            color: '#0085A1', 
                            text: 'Reset',
                            link: `http://127.0.0.1:4000/reset/password/${result._id}`
                        }
                    }
                    
                }
            };

            var emailBody = mailGenerator.generate(email);
        
            let info = {
            from: process.env.MAIL_USERNAME, 
            to: user_email, 
            html: emailBody
            };
        
            transporter.sendMail(info, function(err, data) {
            if (err) { return res.render('checkuser', {msg: 'Fail to Send Email, Internal Error Occured. '+ err, err: ''}); } 
            else { return res.render('checkuser', {msg: 'Email Has Been Send to Your Email Address.', err: ''}); }
            });
        }
        
        main().catch(console.error);

        }
        else {
            res.render('checkuser', {msg: '', err: 'Email does not Exist.'});
        }
        

    }).catch((err)=>{
        res.render('checkuser', {msg: '', err: 'Email does not Exist.'});
    })

      

    

}