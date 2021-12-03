const mongoose = require('mongoose');

//To connect the database mongoose
mongoose.connect('mongodb://localhost:27017/student_task',
    {
        useNewUrlParser: true,
        //useCreateIndex: true,
        useUnifiedTopology: true
    });

mongoose.connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});
