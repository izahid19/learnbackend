const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/User.js")

const app = express();

const PORT = 5000

app.use(express.json())

// find send by emailId

app.get("/user", (req, res) =>{
    const userEmail = req.body.email
    try {
        const user = User.find({ email: userEmail})
        res.send(user)
    } catch (err) {
        res.status(400).send("something went wrong")
    }
})
app.post("/signup", async (req, res) => {
 const user = new User(req.body)

 try {
     await user.save()
     res.send("User added sucessfully")
 } catch (err) {
     res.status(400).send("something went wrong")
 }

})

connectDB().then(() => {
    console.log("database connected")
    app.listen(PORT , ()   => {
        console.log(`server is runing on PORT:${PORT}`)
    })
}).catch((err) => {
    console.log("something went wrong while connecting")
})
