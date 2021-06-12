module.exports = (req,res,next)=>{
    if(req.files == null || req.body.title == null || req.body.subtitle == null){
    return res.redirect('/posts/new')
    }
    next()
    }
    