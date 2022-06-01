const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//For User
router.post('/', auth, recipeController.postRecipe);
router.get('/', auth, recipeController.getAllRecipes);
router.get('/:id', auth, recipeController.getRecipeById);
router.delete("/:id", auth, recipeController.deleteRecipeById);
router.put("/:id", auth, recipeController.updataRecipeById);

module.exports = router;