const { Recipe, validateRecipe } = require("../models/recipe")
const { User } = require("../models/user")
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    async postRecipe(req, res) {
        console.log(req.body)
        let { error } = validateRecipe({userId: req.user._id, recipeName: req.body.recipeName})
        if (error) return res.status(400).send(error.details[0].message)

        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).send("The user with the given ID was not found")

        let recipe = new Recipe({
            recipeName: req.body.recipeName,
            userId: ObjectId(req.user._id)
        });
        recipe = await recipe.save()
        res.send(recipe)
    },

    async getAllRecipes(req, res) {
        const recipes = await Recipe.find({userId: ObjectId(req.user._id)}).sort("name")
        res.send(recipes)
    },

    async getRecipeById(req, res) {
        const recipe = await Recipe.findOne({_id: req.params.id, userId: ObjectId(req.user._id)})
        if (!recipe) return res.status(404).send("The recipe with the given ID was not found")
        res.send(recipe)
    },

    async deleteRecipeById(req, res) {
        const recipe = await Recipe.findOneAndRemove({_id: req.params.id, userId: ObjectId(req.user._id)})
        if (!recipe) return res.status(404).send("The recipe with the given ID was not found")
        res.send("Recipe Deleted")
    },

    async updataRecipeById(req, res) {
        let { error } = validateRecipe({userId: req.user._id, recipeName: req.body.recipeName});
        if (error) return res.status(400).send(error.details[0].message);

        const recipe = await Recipe.findOneAndUpdate(
            {_id: req.params.id, userId: ObjectId(req.user._id)},
            {
                recipeName: req.body.recipeName
            },
            { new: true }
        ).exec((err, recipe) => {
            if (!recipe) {
                return res
                    .status(404)
                    .send("The recipe with the given ID was not found.");
            }
            res.send(recipe);
        });
    }
}

