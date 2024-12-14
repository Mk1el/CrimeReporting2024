const bcrypt = require('bcryptjs');
const db = require('../config/models'); 

// User Registration Controller
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]);

        res.status(201).json({
            message: 'User registered successfully',
            userId: result[0].insertId,  // The new user's ID from the database
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Fetch user by email using raw SQL query
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        // Check if user was found
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compare the password (hashed) with the entered password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If password does not match, return error
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If successful, create a session for the user
        req.session.userId = user.id;  // Store user ID in session
        req.session.username = user.username;

        // Optionally, send the user to the user profile/dashboard page
        return res.redirect('/user');  // Redirect to user profile/dashboard page

    } catch (error) {
        // Handle any unexpected errors
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
// In registerController.js
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/login'); // Redirect to login page or home
    });
};
