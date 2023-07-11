const express= require("express")
const app= express()
const {connection }= require("./config/db")
const { userRouter }=require("./routes/user.route")
 
const {  UploadRouter}=require("./routes/upload.route")
const cors = require("cors")
require("dotenv").config()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use("/user",userRouter)
 

app.use("/file", UploadRouter)

app.listen(process.env.PORT, async()=>{
    try {
        await connection
        console.log("Connected to Database")
    } catch (error) {
        console.log("error",error)
        console.log("Can not connect to Database !")
    }
    console.log(`server is Running on PORT : ${process.env.PORT}`)
})