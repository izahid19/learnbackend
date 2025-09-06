const Validator = require("validator");
const validationForSignup = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName){
        throw new Error("firstName and lastName are required");
    }
    else if(firstName.length < 3 || lastName.length > 40){
        throw new Error("firstName and lastName should be between 3 and 40 characters");
    }
    else if(!Validator.isEmail(email)){
        throw new Error("email is invalid");
    } else if(!Validator.isStrongPassword(password)){
        throw new Error("password is weak");
    }
    
};

const validationForLogin = (req) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new Error("email and password are required");
    }
    else if(!Validator.isEmail(email)){
        throw new Error("email is invalid");
    }
};

module.exports = {validationForSignup, validationForLogin};