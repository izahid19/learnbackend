const express = require("express");

const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const USER_SAFE_DATA = "firstName lastName age gender profilePicture hobbies desc";


userRouter.get("/user/request/review" , userAuth , async (req , res) => {
    try{
        const loggedInUserId = req.user._id;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUserId, 
            status: "interested"
        }).populate(
            "fromUserId", USER_SAFE_DATA
        )
        res.json({message: "Connection requests fechced successfully", data: connectionRequests});
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
})

userRouter.get("/user/connection", userAuth ,async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const connectionRequests = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInUserId , status: "accepted"},
                {toUserId: loggedInUserId , status: "accepted"}
            ]
        }).populate(
            "fromUserId", USER_SAFE_DATA
        ).populate(
            "toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) =>{ 
            if(row?.fromUserId?._id?.toString() === loggedInUserId?._id?.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        })

        res.json({data});
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
})

userRouter.get("/user/feed" , userAuth , async(req , res) => {
    try{
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 100 ? 100 : limit;
        const skip = (page - 1) * limit;
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id },
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequests.forEach((row) => {
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUserFromFeed) }},
                {_id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({users});

    }catch(err){
        res.status(400).send("Error: " + err);
    }
})

module.exports = { userRouter };