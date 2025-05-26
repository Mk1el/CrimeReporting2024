const express = require('express');
const router = express.Router();
const db = require('../config/models'); 

router.get('/track-reports/:userId', (req, res) => {
    const userId = req.params.userId;
  
    // Query to get the reports for the user
    const query = `
      SELECT crime_type, crime_location, crime_date, crime_description, status
      FROM user_crime_reports
      WHERE user_id = ?
      ORDER BY submitted_at DESC
    `;
  
    db.execute(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching reports');
      }
      res.json(results); // Return the results as JSON
    });
  });

module.exports = router;