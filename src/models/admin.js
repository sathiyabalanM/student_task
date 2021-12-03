const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8
    },
    tokens: [{
        token: {
            type: String
        }
    }]
}, {
    timestamps: true
});

//to hashing the password by bcrypt
AdminSchema.pre('save', async function () {
    var admin = this;
    if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
});

//to compare the password between register and login
AdminSchema.statics.findByCredential = async function (email, password) {
    var admin = await Admin.findOne({ email: email });
    if (!admin) {
        throw new Error("Unable to Login");
    }
    var check = await bcrypt.compare(password, admin.password);

    // if(!check){
    //     throw new Error("Unable to Login");
    // }
    return admin;
}

//to generate the jwt token for admin
AdminSchema.methods.generateAuthToken = async function () {
    try {
        var admin = this;
        var token = jwt.sign({ _id: admin._id }, "accesskeyforstudenttask", {
            expiresIn: "1 days"
        });
        admin.tokens = admin.tokens.concat({
            token: token
        });
        await admin.save();
        return token;
    } catch (e) {
        return e;
    }
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;