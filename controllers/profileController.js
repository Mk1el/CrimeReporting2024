const bcrypt = require('bcryptjs');
const db = require('../config/models'); 
// Profile page handler (GET request)
exports.getProfile = (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("User not authenticated");
    }

    const userId = req.session.user.id;
    db.execute('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).send("Database error");
        }
        const user = results[0];
        res.render('profile', { user });
    });
};

exports.updateProfile = (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("User not authenticated");
    }

    const { username, email, phone, password, preferences } = req.body;
    const userId = req.session.user.id;

    // Optional: Hash the password if it's being updated
    let hashedPassword = password ? bcrypt.hashSync(password, 10) : null;
    const updatedPassword = hashedPassword || undefined;  // Don't update password if not provided

    const query = 'UPDATE users SET username = ?, email = ?, phone = ?, password = ?, preferences = ? WHERE id = ?';
    db.execute(query, [username, email, phone, updatedPassword, preferences, userId], (err, result) => {
        if (err) {
            console.error("Error updating profile: ", err);
            return res.status(500).send("Failed to update profile");
        }
        // Redirect to the updated profile page after successful update
        res.redirect('/profile');
    });
};

