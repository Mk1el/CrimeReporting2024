const express = require('express');
const router = express.Router();
const db = require('../config/models');  

// Admin dashboard route (GET request)
router.get('/', async (req, res) => {
    try {
        // Fetch all crime reports from the database
        const [results, fields] = await db.execute('SELECT * FROM crime_reports');

        // Fetch total number of users, reports, and pending reports
        const [totalUsers] = await db.execute('SELECT COUNT(*) AS total FROM users');
        const [totalReports] = await db.execute('SELECT COUNT(*) AS total FROM crime_reports');
        const [totalUserReports] = await db.execute('SELECT COUNT(*) AS total FROM user_crime_reports');

        // Render the admin dashboard with the crime reports and statistics
        res.render('admin', {
            totalUsers: totalUsers[0].total,    // Ensure it's a number
            totalReports: totalReports[0].total, // Ensure it's a number
            totalUserReports: totalUserReports[0].total, // Ensure it's a number
            reports: results // Passing the reports data
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching data' });
    }
});
router.get('/user-crime-reports', (req, res) => {
    db.query('SELECT * FROM user_crime_reports', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// View all registered users
router.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Update anonymous report
router.put('/update-crime-reports/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.query(
        'UPDATE anonymous_reports SET status = ? WHERE id = ?',
        [status, id],
        (err, results) => {
            if (err) throw err;
            res.send('Report updated successfully');
        }
    );
});

// Update user crime report
router.put('/update-user-crime-reports/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.query(
        'UPDATE user_crime_reports SET status = ? WHERE id = ?',
        [status, id],
        (err, results) => {
            if (err) throw err;
            res.send('User crime report updated successfully');
        }
    );
});

// Delete an anonymous report
router.delete('/delete-crime-reports/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM anonymous_reports WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send('Anonymous report deleted successfully');
    });
});

// Delete a user crime report
router.delete('/delete-user-crime-report/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM user_crime_reports WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send('User crime report deleted successfully');
    });
});

module.exports = router;
