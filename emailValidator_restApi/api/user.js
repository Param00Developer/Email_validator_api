import express from "express";
import { User_Details } from "../model/model.js";
import jwt from "jsonwebtoken";
import sendMail from "../controller/mail.js";
import bcrypt from "bcrypt";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

//Function to encrypt the password
const saltRounds = 10;
async function hashPassword(password) {

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

//to decrypt the password
async function comparePassword(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

//function to direct to email authentication controller 'mail.js'
async function emailAuth(email, id) {
  sendMail(email, id);
}

//function to generate token for user embedding user id into the payload
function generateToken(uid) {
  const secretKey = process.env.SECERATE_KEY;
  const payload = { userId: uid };
  const token = jwt.sign(payload, secretKey, { expiresIn: "30m" });
  return token;
}

//Token validation middleware
const tokenValidation = (req, res, next) => {
  try {
    const secretKey = process.env.SECERATE_KEY;
    console.log(req.headers.authorization);
    const decode = jwt.verify(
      req.headers.authorization.split(" ")[1],
      secretKey
    );
    req.id = decode.userId;
  } catch (err) {
    res.status(500).json({ Error_Message: err.message });
  } finally {
    next();
  }
};

//route to signup for user -->generating an email to verify user at the end
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const hashPass = await hashPassword(password);
    const added_user = new User_Details({
      name,
      email,
      password: hashPass,
      mobile,
    });
    emailAuth(added_user["email"], added_user["_id"]);
    await added_user.save();
    res.status(200).json("Please Verify your email ..");
  } catch (err) {
    res.status(500).json({ Error_Message: err.message });
  }
});

//route to validate user when he/she clicks the link send to them through email 
router.get("/confirmation/:token", async (req, res) => {
  try {
    const secretKey = process.env.SECERATE_KEY;
    const decode = jwt.verify(req.params.token, secretKey);
    const id = decode.userId;
    await User_Details.findByIdAndUpdate({ _id: id }, { confirmed: true })
      .then((updatedDoc) => {
        console.log("Document updated:", updatedDoc);
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });

    res.send("Authentication Successful...");
  } catch (e) {
    res.send(e.message);
  }
});

//route for general checking by the developer only for testing purpose
router.get("/", async (req, res) => {
  try {
    const users = await User_Details.find({});

    res.status(200).json({ Data: users });
  } catch (err) {
    res.status(500).json({ Error_Message: err.message });
  }
});

//route for user login return a token for user access-->only when he/she had verified there email 
router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User_Details.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid User name ..");
    } else {
      const match = await comparePassword(password, user.password);
      if (match) {
        if (user.confirmed == true) {
          const token = generateToken(user._id);
          res.status(200).json({ Login_Token: token });
        } else throw new Error("Conform your mail..");
      } else {
        throw new Error("Invalid Password ..");
      }
    }
  } catch (err) {
    res.status(500).json({ Error_Message: err.message });
  }
});
//Function to get user details to only the valid user
router.get("/userdetail", tokenValidation, async (req, res) => {
  try {
    const user = await User_Details.find({ _id: req.id });
    res.status(200).json({ Data: user });
  } catch (err) {
    res.status(500).json({ Error_Message: err.message });
  }
});

//Function to update user details to only the valid user
router.put("/userdetail", tokenValidation, async (req, res) => {
  try {
    const id = req.id;
    const u_User_Details = await User_Details.findByIdAndUpdate(id, req.body);
    if (!u_User_Details) {
      return res.status(404).json("Invalid Id provided..");
    }
    res.status(200).json({ Updated_Data: u_User_Details });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error_Message: err });
  }
});

//route to delete user entries from the database
router.delete("/userdetail", tokenValidation, async (req, res) => {
  try {
    const id = req.id;
    const u_User_Details = await User_Details.findByIdAndDelete(id, req.body);
    if (!u_User_Details) {
      return res.status(404).json("Invalid Id provided..");
    }
    res.status(200).json("Data was successfuly deleted..");
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error_Message: err });
  }
});

export default router;
