require('./db/mongoose.js');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

const Student = require('./models/student');
const Admin = require('./models/admin');
const auth = require('./middleware/auth');

//CRUD operations for students

//api to create student
app.post('/api/student', auth, async (req, res) => {
    try {
        var age = getAge(req.body.dateOfBirth);
        req.body.age = age;
        var student = new Student(req.body);
        await student.save();
        res.status(201).send("Student created successfully");
    } catch (e) {
        res.status(500).send("Unable to create");
    }
});

//function of calculating age about DOB
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//api to get all students
app.get('/api/student', auth, async (req, res) => {
    try {
        var students = await Student.find(req.query);
        res.status(200).send(students);
    } catch (e) {
        res.status(500).send("Unable to get the students");
    }
});

//api to edit student
app.put('/api/student/:id', auth, async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).send("Updated Successfully");
    } catch (e) {
        res.status(500).send("Unable to edit the student");
    }
});

//api to delete student
app.delete('/api/student/:id', auth, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Successfully");
    } catch (e) {
        res.status(500).send("Unable to delete the student");
    }
});

//api to register admin
app.post('/api/reg', async (req, res) => {
    try {
        var admin = new Admin(req.body);
        await admin.save();
        res.status(201).send("Registered sucessfully");
    } catch (e) {
        res.status(500).send("Unable to register");
    }
})

// api to login admin and genrate jwt token
app.post('/api/login', async (req, res) => {
    try {
        var admin = await Admin.findByCredential(req.body.email, req.body.password);
        var token = await admin.generateAuthToken();
        res.status(200).send({
            admin,
            token
        })
    } catch (e) {
        res.status(500).send("Unable To Login");
    }
})

//api to expire the jwt in admin logout
app.post('/api/logout', auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.admin.save();
        res.status(200).send("Logout successfully");
    } catch (e) {
        res.status(500).send("Unable To Logout");
    }
})

//to start the server
app.listen(1500, function () {
    console.log("The server runs at port : 1500");
})