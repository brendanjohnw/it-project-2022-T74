// Auth.js is a file that handles the routing for routes that require authentication

import express from "express";
import session from "express-session";
import flash from "express-flash";
import passport from "../passport.js";
import {
    getLogin,
    getRegister,
    getDashboard,
    getAddbook,
    getBook,
    getEditbook,
    getSettings,
    getAddFriends,
    getFilter,
    getRecomm,
} from "../controllers/AuthController.js";
import { Book, User, Comment } from "../models/User.js";
import { username_login } from "../passport.js";

export const authRouter = express.Router();
authRouter.use(flash());

// Creating the session cookies
authRouter.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || "keyboard cat",
        name: "demo", // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: "strict",
            httpOnly: true,
            secure: authRouter.get("env") === "production",
        },
    })
);

if (authRouter.get("env") === "production") {
    authRouter.set("trust proxy", 1); // trust first proxy
}
var count = 1;

// Callback function to protect a route, add this function to protect routes
export const checkAuthentication = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    try {
        if (req.session.passport.user !== undefined && count == 1) {
            count += 1;
        }
    } catch {
        res.redirect("/auth/login");
        return;
    }
    return next();
};

// Some routes for sign up, login and the dashboard
authRouter.get("/", getRegister);
authRouter.get("/login", getLogin);
authRouter.get("/dashboard", checkAuthentication, getDashboard);
authRouter.get("/settings", checkAuthentication, getSettings);

// Handle login
authRouter.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect("/dashboard");
    }
);

// Handle logout
authRouter.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});

authRouter.post("/logout", (req, res) => {
    req.logout();
    req.session.destroy((err) => res.redirect("/"));
});

// end of the login difficult shit
// Start putting the stuff other than login below this line
// ------------------------------------------------------------

// Route for adding a book

authRouter.get("/addbook", checkAuthentication, getAddbook);

// Route for viewing book

authRouter.get("/book", checkAuthentication, getBook);

// Route for editing book

authRouter.get("/editbook", checkAuthentication, getEditbook);

// Route for finding friends

authRouter.get("/findfriends", checkAuthentication, getAddFriends);

// Route for deleting book
authRouter.get("/deletebook", checkAuthentication, async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.query.id });
        const comments = book.comments;
        for (var i = 0; i < comments.length; i++) {
            await Comment.findByIdAndDelete(comments[i]._id);
        }
        await User.updateOne(
            { username: username_login },
            { $pull: { book_array: { _id: req.query.id }, wishlist_array: { _id: req.query.id } } }
        );
        await Book.findByIdAndDelete(req.query.id);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/dashboard");
});

// Delete a comment
authRouter.get("/delete-comment", checkAuthentication, async (req, res) => {
    try {
        await User.updateOne(
            { username: username_login, "book_array._id": req.query.book },
            { $pull: { "book_array.$.comments": { _id: req.query.comment } } }
        );
        await User.updateOne(
            { username: username_login, "wishlist_array._id": req.query.book },
            { $pull: { "wishlist_array.$.comments": { _id: req.query.comment } } }
        );
        await Book.updateOne({ _id: req.query.book }, { $pull: { comments: { _id: req.query.comment } } });
        await Comment.findByIdAndDelete(req.query.comment);
    } catch (err) {
        console.log(err);
    }
    res.redirect(`/book?id=${req.query.book}`);
});

// Filter by a genre
authRouter.get("/filter", checkAuthentication, getFilter);

// Recommendations
authRouter.get("/recommendations", checkAuthentication, getRecomm);
