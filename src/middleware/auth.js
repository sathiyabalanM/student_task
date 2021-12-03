const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

//auth middleware used to aunthenticate the student CRUD operations
const auth = async (req, res, next) => {
    try {
        var token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'accesskeyforstudenttask');
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!admin) {
            res.status(403).send("Unauthorized");
            return;
        }

        req.admin = admin;
        req.token = token;
        next();
    } catch (e) {
        res.status(500).send("Internal server error");
    }
}

module.exports = auth;