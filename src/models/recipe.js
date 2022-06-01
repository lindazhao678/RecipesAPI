//Require Modules
const Joi = require("joi");
const mongoose = require("mongoose");
//Other Schemas 
const { userSchema } = require("./user");

const Recipe = mongoose.model(
    "Recipes",
    new mongoose.Schema({
        recipeName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 25,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        createDate: {
            type: Date,
            default: Date.now,
        },
    })
);

//Joi validation
function validateRecipe(recipe) {
    const schema = Joi.object({
        recipeName: Joi.string().min(2).max(50).required(),
        userId: Joi.objectId().required(),
    });
    return schema.validate(recipe);
}

//Exports
module.exports.Recipe = Recipe;
module.exports.validateRecipe = validateRecipe;
