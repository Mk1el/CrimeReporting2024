const express = require('express');
const multer = require('multer');
const db = require('../config/models');
const router = express.Router();

// Set up multer storage configuration (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle the POST request for submitting a report
router.post('/', upload.fields([{ name: 'crime-image', maxCount: 1 }]), (req, res) => {
    const crime_type = req.body['crime-type'];
    const description = req.body['description'];
    const location = req.body['location'];
    const date = req.body['date'];

    // Get the file buffer (if uploaded), otherwise null
    const crime_image = req.files && req.files['crime-image'] ? req.files['crime-image'][0].buffer : null;

    // Log file size for debugging purposes
    console.log('Crime Image:', crime_image ? crime_image.length : 'No image uploaded');

    // Basic validation to ensure all necessary fields are present
    if (!crime_type || !description || !location || !date) {
        return res.status(400).json({ error: 'Crime details and location are required.' });
    }

    // Insert the crime report into the database
    const query = `
        INSERT INTO crime_reports (crime_type, description, location, date, crime_image)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [crime_type, description, location, date, crime_image];

    db.execute(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting crime report:', err);
            return res.status(500).json({ error: 'Failed to submit report.' });
        }

        // After submitting the report, check if the user is anonymous
        let id = req.session.id;

        // If the user is anonymous, assign them an anonymous user ID
        if (!userId) {
            // Assign a temporary user ID (create a record if needed in the database)
            userId = generateAnonymousUserId(); // This can be a function that generates a unique ID or creates a record in the DB
            req.session.id = id; // Store in session to track the user
        }

        // Redirect the user to their personal page (user profile page)
        return res.redirect(`/user/${id}`);
    });
});

module.exports = router;

// Function to generate a temporary anonymous user ID
function generateAnonymousUserId() {
    // Generate a unique ID or create a new record in the database for the anonymous user
    // You could use UUID or any other method to generate a unique ID
    return Math.floor(Math.random() * 1000000); // Example for generating a random ID
}
