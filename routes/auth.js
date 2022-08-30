
// Auth.js is a file that handles the routing for routes that require authentication
import express from 'express'
import session from 'express-session'
import flash from 'express-flash'
import passport from '../passport.js';
import { getLogin, getRegister, getDashboard, getAddbook, getBook } from '../controllers/AuthController.js'

export const authRouter = express.Router()
authRouter.use(flash())

// Creating the session cookies
authRouter.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: authRouter.get('env') === 'production',
        },
    }),
);

if (authRouter.get('env') === 'production') {
    authRouter.set('trust proxy', 1); // trust first proxy
}
var count = 1

// Callback function to protect a route, add this function to protect routes
export const checkAuthentication = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    try {
        if (req.session.passport.user !== undefined && count == 1) {
            res.redirect('/auth/dashboard');
            count += 1
        }
    } catch {
        res.redirect('/auth/login');
    }
    return next();


};

// Some routes for sign up, login and the dashboard
authRouter.get('/', getRegister)
authRouter.get('/login', getLogin);
authRouter.get('/dashboard', checkAuthentication, getDashboard)

// Handle login
authRouter.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect('/dashboard');
    },
);

// Handle logout
authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

authRouter.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => res.redirect('/'));
});

// end of the login difficult shit
// Start putting the stuff other than login below this line
// ------------------------------------------------------------

// Route for adding a book
authRouter.get('/addbook', getAddbook);

// Route for viewing book

authRouter.get('/book', getBook);