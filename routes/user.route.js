const express = require("express")
const userRouter= express.Router()
const { UserModel}=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
require("dotenv").config()

userRouter.post("/register",async(req,res)=>{
    const {username,email,password}=req.body

    const find_email= await UserModel.findOne({email})
    if(find_email){
       return res.status(400).send({message:"Email already exists"})
    }
    try {
         bcrypt.hash(password, 5 ,  async(err, hash)=> {
            // Store hash in your password DB.
            if(err){
                res.status(400).send({message:"Error while registering the user !"})
            }else{
                const newUser= new  UserModel({
                    username,
                    email,
                    password:hash
                })
                await newUser.save()
                res.status(200).send({message:"User registered successfully"})
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(400).send({message:"Error while registering the user !"})
    }
})

userRouter.post("/login", async(req,res)=>{
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
    
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              const token = jwt.sign({ userId: user._id, username: user.username}, process.env.SECRET_KEY );
              res.status(200).send({ msg: "login successfull !", token: token , 
               username : user.username });
            } else {
              res.status(400).send({"msg" : "Wrong credentials"});
            }
          });
        } else {
            res.status(400).send({"msg" : "Wrong credentials"});
        }
      } catch (error) {
        res.status(400).send({"msg" : "Wrong credentials"});
      }
})

module.exports={
    userRouter
}