import { logged_in_user } from "../app.js";
import { Book, User } from "../models/User.js";
import { username_login } from "../passport.js";

export const getLogin = (req, res) => {
    res.render("login", { flash: req.flash("error"), title: "Login", message: req.flash("success") });
};

export const getRegister = (req, res) => {
    res.render("signup", { flash: req.flash("flash"), title: "Signup" });
};

export const getSettings = async (req, res) => {
    try {
        console.log(username_login);
        const userData = await User.find(
            { username: username_login },
            {
                username: true,
                book_array: true,
            }
        ).lean();
        res.render("settings", {
            UserData: userData,
            flash: req.flash("flash"),
        });
    } catch (err) {
        console.log(err);
    }
};

export const getDashboard = async (req, res) => {
    try {
        console.log(username_login);
        const userData = await User.find(
            { username: username_login },
            {
                username: true,
                book_array: true,
            }
        ).lean();
        res.render("dashboard", {
            UserData: userData,
        });
    } catch (err) {
        console.log(err);
    }
};

export const getAddbook = (req, res) => {
    res.render("addbook", { flash: req.flash("flash") });
};

export const getBook = async (req, res) => {
    try {
        const bookData = await Book.find(
            { _id: req.query.id },
            {
                _id: true,
                title: true,
                author: true,
                description: true,
                date_added: true,
                in_wishlist: true,
                genre: true,
                filename: true,
                comments: true,
            }
        ).lean();
        const userData = await User.find(
            { username: username_login },
            {
                username: true,
            }
        ).lean();
        res.render("book", { BookData: bookData, UserData: userData, flash: req.flash("flash") });
    } catch (err) {
        console.log(err);
    }
};

export const getEditbook = async (req, res) => {
    try {
        const bookData = await Book.find(
            { _id: req.query.id },
            {
                _id: true,
                title: true,
                author: true,
                description: true,
                genre: true,
                filename: true,
            }
        ).lean();
        res.render("editbook", { BookData: bookData, flash: req.flash("flash") });
    } catch (err) {
        console.log(err);
    }
};

export const getFilter = async (req, res) => {
    try {
        const userData = await User.aggregate([
            { $match: { username: username_login } },
            {
                $project: {
                    username: true,
                    book_array: {
                        $filter: { input: "$book_array", as: "book", cond: { $eq: ["$$book.genre", req.query.genre] } },
                    },
                },
            },
        ]);
        res.render("dashboard", {
            UserData: userData,
        });
    } catch (err) {
        console.log(err);
    }
};
