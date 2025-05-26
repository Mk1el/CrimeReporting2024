const express = require('express');
const router = express.Router();
const db = require('../config/models');  // Assuming db is using the promise API

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
            totalReports: totalReports[0].total,
            totalUserReports: totalUserReports[0].total,
            reports: results // Passing the reports data
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching data' });
    }
});
router.put('/reports/:id', (req, res) => {
    const { id } = req.params;
    const { crime_type, description, status } = req.body;  // You can add any other fields to update

    const query = 'UPDATE crime_reports SET crime_type = ?, description = ?, status = ? WHERE report_id = ?';
    db.query(query, [crime_type, description, status, id], (err, result) => {
        if (err) throw err;
        res.send('Report updated successfully');
    });
});

// Delete report
router.delete('/crime_reports/:id', (req, res) => {
    const crimeReportId = req.params.id;
    CrimeReport.findByIdAndDelete(crimeReportId, (err, report) => {
      if (err || !report) {
        return res.status(404).send('Crime report not found');
      }
      res.status(200).send('Crime report deleted');
    });
  });

module.exports = router;
