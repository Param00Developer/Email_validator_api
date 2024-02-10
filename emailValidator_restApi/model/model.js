import mongoose from "mongoose";
const userModel = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please specify a name.."]
        },
        email: {
            type: String,
            require: [true, "Please specify a email.."],
            unique:true,
            message: `Email already exists.`
        },
        password: {
            type: String,
            require:true
        },
        mobile: {
            type: Number,
            unique:true,
            message: `Mobile number already exists.`
        }
        ,confirmed:{
            type:Boolean,
            default:false

        }
    },
    { timestamps: true }
)
const User_Details = mongoose.model("User_Details", userModel)
export {User_Details}