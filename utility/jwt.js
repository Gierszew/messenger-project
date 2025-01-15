const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const {SECRET_KEY} = process.env;

function generateToken(user_id, login) {
    return jwt.sign({user_id, login}, SECRET_KEY, {expiresIn: "1h"});
}

module.exports = {
    generateToken
}