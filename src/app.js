const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/User.js");
const Bycrypt = require("bcrypt");
const { validationForSignup, validationForLogin } = require("./utils/validation.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth.js");

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
  try {
    await validationForSignup(req);
    const { firstName, lastName, email, password } = req.body;
    const enycryptedPassword = await Bycrypt.hash(password, 10);
    console.log(enycryptedPassword);
    const user = new User({ firstName, lastName, email, password : enycryptedPassword });
    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    await validationForLogin(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordCorrect = await Bycrypt.compare(password, user.password);
    const token = jwt.sign({userId: user._id}, "secretKey", {expiresIn: "1d"});
    if(!isPasswordCorrect){
      throw new Error("Invalid password");
    } else {
      res.cookie("token", token)
      res.send("Login successful");
    }
  }
  catch(err){
    res.status(400).send("Error: " + err);
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try{
  const user = req.user;
  console.log("user", user);
  res.send(user);
  }
  catch(err){
    res.status(400).send("Error: " + err);
  }
})

app.post("/sendRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending user request");
  res.send(user.firstName + " " + user.lastName + " Request sent");
})

connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(PORT, () => {
      console.log(`server is runing on PORT:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("something went wrong while connecting" + err);
  });
