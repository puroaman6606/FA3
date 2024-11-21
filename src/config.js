const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://backend_project:Rishav02@cluster0.qcelsay.mongodb.net/USERS?retryWrites=true&w=majority&appName=Cluster0");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// // Create Schema
// const Loginschema = new mongoose.Schema({
//     name: {
//         type:String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// Create Schema
const Loginschema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure the email is unique
    },
    password: {
        type: String,
        required: true
    }
});


// Export the schema model
// const User = mongoose.model('User', Loginschema);

// module.exports = User;


// collection part
const collection = new mongoose.model("USERS", Loginschema);
console.log()
module.exports = collection;



