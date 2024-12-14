const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./config/models'); 
const app = express();
const PORT = process.env.PORT || 3001;

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || '12345678', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  
        maxAge: 1000 * 60 * 60 * 24  
    }
}));

// Middleware
app.use(express.json());  // Built-in middleware to parse JSON
app.use(express.urlencoded({ extended: true }));  // Built-in middleware to parse URL-encoded data
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public' folder

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import route modules
const indexRoutes = require('./routes/index');
const reportRoutes = require('./routes/report');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const userRouter = require('./routes/user');
const adminRoutes = require('./routes/admin'); 
const profileRouter = require('./routes/profile');
const reportsRouter = require('./routes/reports');
const track_reportsRouter = require('./routes/track_reports');
// Use route modules
app.use('/', indexRoutes); 
app.use('/report', reportRoutes); 
app.use('/register', registerRoutes); 
app.use('/reports', reportsRouter)
app.use('/login', loginRoutes); 
app.use('/logout', logoutRoutes); 
app.use(track_reportsRouter);
app.use(userRouter); 
app.use(profileRouter); 

// Forgot password route (additional functionality)
app.get('/user/forgot-password', (req, res) => {
    res.render('forgot-password');  // Render the forgot-password view
});

// Admin route
app.use('/admin', adminRoutes);  // Handles routes under '/admin'

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
