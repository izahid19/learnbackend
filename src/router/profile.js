const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

profileRouter.put("/profile/update", userAuth, async (req, res) => {
  try {
    // Validate incoming data
    validateEditProfileData(req);

    const loggedInUser = req.user;

    // Define which fields are allowed for update
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "profilePicture",
      "hobbies",
      "desc",
    ];

    const payload = req.body;

    // Check for invalid keys
    const invalidKeys = Object.keys(payload).filter(
      (key) => !ALLOWED_UPDATES.includes(key)
    );
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        error: `Invalid fields: ${invalidKeys.join(", ")}`,
      });
    }

    // Update allowed fields
    ALLOWED_UPDATES.forEach((field) => {
      if (payload[field] !== undefined) {
        loggedInUser[field] = payload[field];
      }
      // Remove the else block to avoid resetting fields to null
      // This maintains existing values for fields not provided in payload
    });

    await loggedInUser.save();

    // Create sanitized response object
    const sanitizedUser = {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      age: loggedInUser.age,
      gender: loggedInUser.gender,
      profilePicture: loggedInUser.profilePicture,
      hobbies: loggedInUser.hobbies,
      desc: loggedInUser.desc,
      emailId: loggedInUser.emailId, // if you want to include email
      // Only include _id if absolutely necessary for the client
      // _id: loggedInUser._id
    };

    res.json({
      message: "Profile updated successfully",
      data: sanitizedUser,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || "Failed to update profile",
    });
  }
});

module.exports = { profileRouter };
