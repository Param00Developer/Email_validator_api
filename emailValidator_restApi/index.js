import express from "express"
import 'dotenv/config.js'
import router from "./api/user.js"
import mongoose from "mongoose";


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

//all routes are in api/user.js
app.use('/', router)


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to data base");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}/ `)
        })
    })
    .catch((err) => {
        console.log(`Sorry some error occured :${err}`)
})


