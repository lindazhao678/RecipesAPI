const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User, validateUser } = require('../models/user')

module.exports = {
    async postUser(req, res) {
        console.log(req.body)
        const { error } = validateUser(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send("User already registered.")

        user = new User(
            _.pick(req.body, ["firstName", "lastName", "email", "password"])
        )
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();

        const token = user.generateAuthToken()
        res.header("x-auth-token", token)
        let userData = _.pick(user, ["_id", "firstName", "lastName", "email"])
        userData.token = token
        res.send(userData)
    },

    async getAllUsers(req, res) {
        const users = await User.find().select("-password").sort("name")
        const userDataArray = users.map(user => {
            const token = user.generateAuthToken()
            let userData = _.pick(user, ["_id", "firstName", "lastName", "email"])
            userData.token = token;
            return userData;
        });
        res.send(userDataArray)
    },

    async getUserById(req, res) {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("The user with the given ID was not found.");
        res.send(user);
    },

    async deleteUserById(req, res) {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send("The user with the given ID was not found.");
        res.send("user deleted");
    },

    async updateUserById(req, res) {
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            },
            { new: true }
        ).exec((err, user) => {
            if (!user) {
                return res
                    .status(404)
                    .send("User not found.");
            }
            res.send(user);
        });
    },

    async getUserByToken(req, res) {
        const user = await User.findById(req.user._id).select("-password")
        res.send(user)
    },

    async deleteUserByToken(req, res) {
        const user = await User.findByIdAndRemove(req.user._id)
        if (!user) return res.status(404).send("User not found.")
        res.send(user)
    },

    async updateUserByToken(req, res) {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)

        const { error } = validateUser(req.body);
		if (error) return res.status(400).send(error.details[0].message);
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: password,
            },
            { new: true }
        ).exec((err, user) => {
            if (!user) {
                return res
                    .status(404)
                    .send("User not found.");
            }
            res.send(user);
        });
    }
}
