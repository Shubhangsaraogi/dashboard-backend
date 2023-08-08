var jwt = require('jsonwebtoken');

const fetch_id=(req,res,next)=>{

    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error:"please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token,process.env.JWT_SECRET);
        req.user = data.id;
        next();
    } catch(error)
    {
        res.status(401).send({error:"please authenticate using a valid token"});
    }
}
module.exports=fetch_id;