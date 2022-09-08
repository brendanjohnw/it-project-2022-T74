import { logged_in_user } from "../app.js";
import { User } from "../models/User.js";
import { username_login } from "../passport.js";

export const getLogin = (req, res) => {
    res.render("login", { flash: req.flash("error"), title: "Login" });
};

export const getRegister = (req, res) => {
    res.render("signup", { message: req.flash("message") });
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

    res.render('addbook')
}

export const getBook = (req, res) => {
    res.render('book')
}

