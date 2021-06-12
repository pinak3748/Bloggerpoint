const User = require('../models/User.js')
const path = require('path')

module.exports = (req,res)=>{
    User.create(req.body, (error, user) => {
    if(error){
      // error passes error of object and have key value pair
      // error.errors is accessing errors variable in error object
      // Object.keys(error.errors) gives us all the keys in the errors object
      // map for litrate throught each errors
      const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
      req.flash('validationErrors',validationErrors)
      req.flash('data',req.body)
      return res.redirect('/auth/register')
    }
    res.redirect('/auth/login')
  })
}