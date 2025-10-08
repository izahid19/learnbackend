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

    // Define which fields are allowed
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "profilePicture",
      "hobbies",
      "desc",
    ];

    // If using PUT — expect full data, not partial
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

    // Overwrite existing allowed fields
    ALLOWED_UPDATES.forEach((field) => {
      if (payload[field] !== undefined) {
        loggedInUser[field] = payload[field];
      } else {
        // optional: reset missing fields to null for full replacement semantics
        loggedInUser[field] = null;
      }
    });

    await loggedInUser.save();

    res.json({
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || "Failed to update profile",
    });
  }
});

module.exports = { profileRouter };
