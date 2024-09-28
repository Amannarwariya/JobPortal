const jwt = require('jsonwebtoken');
const UserModel = require('../model/User')

const checkUserAuth = async (req,res, next) =>{
    const {token} = req.cookies;
    if(!token){
        res.status(401).json({status:"failed", message:"UnauthorizLogined"})
    } else{
        const data = jwt.verify(token, "secretkeyaccordingtoyou")
        const userdata = await UserModel.findOne({_id: data.ID});
        req.userdata = userdata;

        next()
    }
};

module.exports = checkUserAuth