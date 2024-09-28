const UserModel = require("../model/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


class UserController{
    
    static getUser = async (req,res)=>{
        try {
           const{id} = req.userdata
           const data = await UserModel.findById(id)
           res.status(200).json(data)
        } catch (error) {
            res.status(400)
            .json({ status: "failed", message: error.message})
        }
    };

    static registerUser = async (req, res) => {
        try {
            const {name, email, password, phone, role, confirmpassword} = req.body;
            const User = await UserModel.findOne({email: email});
            if(User){
                res.status(401)
                .json({status: "failed", message: "Email already exists"});
            } else{
                if (name && email && password && role && confirmpassword && phone) {
                    if(password === confirmpassword){
                        const hashedPassword = await bcrypt.hash(password, 10);
                        const result = new UserModel({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            phone: phone,
                            role: role,
                        });
                        await result.save();
                        
                        const token = jwt.sign(
                          { id: result._id, email: result.email },
                          process.env.JWT_SECRET_KEY
                        );
                        res.status(201).cookie("token", token).json({
                            status: "success",
                            message: "Thanks for Registration",
                            token: token
                        });
                    } else {
                        res.status(401)
                        .json({status: "failed", message: "Passwords do not match"});
                    }
                } else {
                    res.status(401).json({status: "failed", message: "All fields are required"});
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({status: "failed", massge:"Internal server error"});
        }
    };

    static login = async (req,res) =>{
        try{
            const {email,password,role} = req.body
            if(email && password && role) {
                const user = await UserModel.findOne({email:email})

                if(user !=null){
                    const isMatched = await bcrypt.compare(password,user.password)
                    if(isMatched){
                        if(user.role == role){
                            const token = jwt.sign(
                              { ID: user._id },
                              process.env.JWT_SECRET_KEY
                            )
                            res.cookie("token", token)
                            res.status(201).json({status: "success", message: "Login OK Report", token: token,user})
                        } else{
                            res.status(401).json({status:"failed",message:"User with this role not found"})
                        }
                    } else{
                        res.status(401).json({status: "failed", message: "Email or password are not same"})
                    }
                } else {
                    res.status(401).json({status: "failed", message: "You are not a register user"})
                }
            } else {
                res.status(401).json({status: "failed", message:"All filed are require"})
            }
        } catch(error) {
            console.log(error)
        }
    };

    static logout = async (req,res) =>{
        try {
            res.status(201)
            .cookie("tooken","",{
                httpOnly: true,
                expires: new Date(Date.now()),
            })
            .json({
                success: true,
                message: "Logged out successfully"
            })
        } catch (error) {
            res.status(400)
            .json({status: "failed", message: error.message})
        }
    };
}

module.exports = UserController