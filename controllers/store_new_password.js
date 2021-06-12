const user = require('../models/User');
const bcrypt = require('bcrypt')


module.exports = (req, res) =>{

    
    let getId = req.params.id;
    let pass = req.body.reset_pass;
    let conf_pass = req.body.conf_pass;

    console.log(getId) 
    
    var h;
    if(pass == conf_pass) {
        bcrypt.hash(pass, 10, (error, hash) => { 

            user.updateOne(
                { _id: getId },
                { $set: { password: hash } },
                { new: true },
              (err, result)=>{
                  if(err) {
                      console.error(err);
                  }
                  console.log('password changed');
                  res.render('login')
              })
      })

        
    }
    else {
        console.log('else')
        res.redirect('/')
    }
}