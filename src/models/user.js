const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024,
    },
    isAdmin: Boolean,
    createDate: {
        type: Date,
        default: Date.now,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        isAdmin: this.isAdmin
    }, config.get("recipesPrivateKey"))
    return token;
}

//Model
const User = mongoose.model("Users", userSchema);

//JOI Validation
function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(50).required(),
    })
    return schema.validate(user);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
