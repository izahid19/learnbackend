const mongoose = require("mongoose");
const Validate = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 40,
  },
  lastName: { 
    type: String, 
    trim: true, 
    minlength: 3, 
    maxlength: 40 
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!Validate.isEmail(value)) {
        throw new Error("invalid email" + value);
      }
    },
  },
  password: { 
    type: String, 
    trim: true,
    validate(value) {
      if (!Validate.isStrongPassword(value)) {
        throw new Error("password cannot contain password" + value);
      }
    } 
  },
  age: { 
    type: Number,
    min: 18,
    max: 100
  },
  gender: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
