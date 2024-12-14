const express = require('express');
const router = express.Router();
const db = require('../config/models');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

// Use authMiddleware to protect the /user route
router.get('/user', authMiddleware, (req, res) => {
    const userId = req.session.userId;  

    console.log("Session userId:", userId);  

    if (!userId) {
        return res.redirect('/login');  
    }

    // Use MySQL query to fetch user by userId (which is an actual user ID from the database)
    db.execute('SELECT * FROM users WHERE id = ?', [userId])  // Correct query with parameterized value
        .then(([rows]) => {
            if (rows.length > 0) {
                const user = rows[0];  // Assuming the user exists
                console.log("User found:", user);  // Log user data
                res.render('user', { user });  // Render user dashboard with user data
            } else {
                console.log("User not found with id:", userId);  // Log if user is not found
                res.status(404).send('User not found');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});
// Setup multer for file uploads

// Define storage settings for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // The folder where files will be saved
    },
    filename: function (req, file, cb) {
        // Use the original file name or generate a unique name
        cb(null, Date.now() + '-' + file.originalname);
    }
});
// Assuming you have a route where users log in
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0 || result[0].password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        // Store the user's numeric ID in the session, NOT the session token
        req.session.id = result[0].id;  // Make sure it's the numeric user ID

        res.status(200).send('Login successful');
    });
});


// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


router.post('/submit-crime', upload.single('evidenceFile'), (req, res) => {
    // Check if the user is logged in (session ID must be set)
    if (!req.session.id) {
        return res.status(403).send('You must be logged in to submit a crime report');
    }

    // Log session ID for debugging purposes
    console.log('Session ID:', req.session.id);  // This is your unique session ID as a string
    
    // Use session ID (string) directly, but ensure the correct field in your database (e.g., user_id)
    const userId = req.session.id;  // Use as is, no need for parseInt
    
    // Destructure the body to get the report details
    const { crimeType, crimeLocation, crimeDate, crimeDescription, contactInfo } = req.body;

    // Check if a file is uploaded
    let evidenceFile = null;
    if (req.file) {
        evidenceFile = req.file.filename;
    }

    // SQL query to insert crime report into the database
    const query = `
    INSERT INTO user_crime_reports (user_id, crime_type, crime_location, crime_date, crime_description, evidence_file, contact_info)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`;

    // Perform the database query
    db.query(query, [userId, crimeType, crimeLocation, crimeDate, crimeDescription, evidenceFile, contactInfo], (err, result) => {
        if (err) {
            console.error('Error inserting crime report: ', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('Crime report submitted successfully!');
            res.redirect('/track');
    });
});
router.get('/track_reports', (req, res) => {
    const userId = req.session.id;  // Use session ID to identify user

    if (!userId) {
        return res.status(403).send('You must be logged in to view your reports');
    }

    const sql = 'SELECT * FROM user_crime_reports WHERE user_id = ?';  // Make sure the column is named 'user_id' or change accordingly

    db.query(sql, [userId], (err, reports) => {
        if (err) {
            console.error('Error fetching reports:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.render('track_reports', { reports: reports });
    });
});

  

module.exports = router;
