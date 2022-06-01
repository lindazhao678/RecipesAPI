const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//For User
router.post('/', userController.postUser);
router.get('/me', auth, userController.getUserByToken);
router.delete('/me', auth, userController.deleteUserByToken);
router.put("/me", auth, userController.updateUserByToken);

//For Admin
router.get('/', [auth, admin], userController.getAllUsers);
router.get('/:id', [auth, admin], userController.getUserById);
router.delete('/:id', [auth, admin], userController.deleteUserById);
router.put('/:id', [auth, admin], userController.updateUserById);

module.exports = router;