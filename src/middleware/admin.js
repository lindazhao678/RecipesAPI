const config = require("config");

function admin(req, res, next) {
    if (!config.get("requiresAuth")) return next();
    
    if (!req.user.isAdmin) {
        return res.status(403).send("Access denied, You are not Admin.")
    }
    next()
}

module.exports = admin;