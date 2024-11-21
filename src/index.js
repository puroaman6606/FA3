

// major change 1



// const express = require("express");
// const path = require("path");
// const session = require('express-session'); // Import express-session
// const collection = require("./config");
// const bcrypt = require('bcrypt');

// const app = express();

// // Configure session middleware
// app.use(session({
//     secret: 'yourSecretKey', // Replace with a strong secret key
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Set to true if using HTTPS
// }));
// app.get("/home", (req, res) => {
//     res.render("home"); // Render the menu.ejs page
// });
// app.get("/menu", (req, res) => {
//     res.render("menu"); // Render the menu.ejs page
// });

// app.get("/about", (req, res) => {
//     res.render("about"); // Render the about.ejs page
// });

// app.get("/contact", (req, res) => {
//     res.render("contact"); // Render the contact.ejs page
// });


// // Convert data into JSON format
// app.use(express.json());
// // Static file
// app.use(express.static("public"));

// app.use(express.urlencoded({ extended: false }));
// // Use EJS as the view engine
// app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//     res.render("login");
// });

// app.get("/signup", (req, res) => {
//     res.render("signup.ejs");
// });

// // Register User
// const User = require('./config');  // Assuming your model is in the 'models/user.js' file

// // Register User
// app.post("/signup", async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, confirmPassword } = req.body;

//         // Check if the email already exists in the database
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             res.send('Email already exists. Please use a different email.');
//         } else if (password !== confirmPassword) {
//             res.send('Passwords do not match. Please try again.');
//         } else {
//             // Hash the password using bcrypt
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(password, saltRounds);

//             // Create a new user document
//             const newUser = new User({
//                 firstName,
//                 lastName,
//                 email,
//                 password: hashedPassword
//             });

//             // Save the user to the database
//             await newUser.save();

//             console.log(newUser);
//             res.redirect('/home');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while registering the user.');
//     }
// });

// // Login user 
// app.post("/login", async (req, res) => {
//     try {
//         // Check for the user by email instead of username
//         const user = await User.findOne({ email: req.body.email }); // Updated to use email

//         if (!user) {
//             return res.send("User not found"); // Updated message
//         }

//         // Compare the hashed password from the database with the plaintext password
//         const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

//         if (!isPasswordMatch) {
//             return res.send("Wrong password"); // Updated message
//         } else {
//             // Set user session upon successful login
//             req.session.userId = user._id; // Store user ID in session
//             res.render("home"); // Make sure this is pointing to your home.ejs
//         }
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         res.send("An error occurred. Please try again."); // General error message
//     }
// });

// // Logout user
// app.get("/logout", (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.send("Error logging out. Please try again.");
//         }
//         res.redirect("/"); // Redirect to login page after logout
//     });
// });

// // Define Port for Application
// const port = 5000;
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });




// major change 2




const express = require("express");
const path = require("path");
const session = require('express-session'); // Import express-session
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();

// Configure session middleware
app.use(session({
    secret: 'yourSecretKey', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to prevent caching for sensitive routes like home
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching
    next();
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is logged in, proceed to the next middleware
    } else {
        res.redirect('/login'); // User is not logged in, redirect to login
    }
};
// Use EJS as the view engine
app.set("view engine", "ejs");

// Route to render the login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Route to render the signup page
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Register User
const User = require('./config');  // Assuming your model is in the 'models/user.js' file

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send('Email already exists. Please use a different email.');
        }
        
        if (password !== confirmPassword) {
            return res.send('Passwords do not match. Please try again.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Redirect to the home page with a success message
        res.redirect('/home?message=Registration successful! Welcome to Fintox Food'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while registering the user.');
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // Use email to find user
        console.log(user)
        if (!user) {
            return res.send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.send("Wrong password");
        } else {
            req.session.userId = user._id; // Store user ID in session
            // Redirect to home with a success message
            res.redirect("/home?message=You are logged in successfully!");
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred. Please try again.");
    }
});


// Define the home route
app.get('/home', isAuthenticated, (req, res) => {
    const message = req.session.successMessage || null;
    req.session.successMessage = null; // Clear the success message after displaying
    res.render('home', { message });
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to home page
});

// Logout user
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Error logging out. Please try again.");
        }
        res.redirect("/login"); // Redirect to login page after logout
    });
});

// Other routes
app.get('/menu', isAuthenticated, (req, res) => {
    const message = req.session.successMessage || null;
    req.session.successMessage = null; // Clear the success message after displaying
    res.render('menu', { message });
});

app.get('/about', isAuthenticated, (req, res) => {
    const message = req.session.successMessage || null;
    req.session.successMessage = null; // Clear the success message after displaying
    res.render('about', { message });
});

app.get('/contact', isAuthenticated, (req, res) => {
    const message = req.session.successMessage || null;
    req.session.successMessage = null; // Clear the success message after displaying
    res.render('contact', { message });
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

