const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/User");
const  ConnectionRequest  = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
          return res.status(400).json({message: "Invalid status"});
        }

        const isUserExists = await User.findById(toUserId);
        if(!isUserExists){
          return res.status(400).json({message: "User not found"});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
          $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
          ]
        });

        if(existingConnectionRequest){
          return res.status(400).json({message: "Connection request already exists"});
        }
        const request = new ConnectionRequest({fromUserId, toUserId, status});
        await request.save();
        res.json({message: `${status} successfully`, data: request});
    }catch(err){
        res.status(400).send("Error: " + err);
    }
  })

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try{

    const loggedInUserId = req.user._id;
    const requestId = req.params.requestId;
    const status = req.params.status;

    const allowdedStatus = ["accepted", "rejected"];
    if(!allowdedStatus.includes(req.params.status)){
      return res.status(400).json({message: "Invalid status"});
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status : "interested"
    });

    if(!connectionRequest){
      return res.status(400).json({message: "Connection request not found"});
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.json({message: `${status} successfully`, data: connectionRequest});

  } catch (err) {
    res.status(400).send("Error: " + err);
  }
})  

module.exports = {requestRouter};