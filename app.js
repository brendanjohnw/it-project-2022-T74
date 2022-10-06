// Listen for requests
import express from "express";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
import { mainRouter } from "./routes/mainRouter.js";
import { authRouter } from "./routes/auth.js";
import { User, Comment, Book } from "./models/User.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import flash from "express-flash";
import bcrypt from "bcryptjs";
import { username_login } from "./passport.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import { ObjectId } from "mongodb";

import passportLocalMongoose from "passport-local-mongoose";

const app = express();
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(cookieParser());

// Serve static content
// Database stuff
app.use(bodyParser.urlencoded({ extended: false }));
const connectionURL =
    "mongodb+srv://brendanino:SVMd3nZJGKyfPJ4M@atlascluster.sbftbx6.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/", mainRouter);
app.use(flash());
app.use(authRouter);

export var logged_in_user = "";

// Registers a user for the app
app.post("/register", async (req, res) => {
    var username = req.body.username;
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        User.countDocuments({ username: username }, function (err, count) {
            if (count > 0) {
                req.flash("flash", "Username already taken");
                res.redirect("/auth");
            } else if (err) {
                res.json({
                    error: err,
                });
            } else {
                let user = new User({
                    username: req.body.username,
                    password: hashedPass,
                });
                user.save()
                    .then((user) => {
                        // res.redirect to the success page
                        logged_in_user = req.body.username;
                        console.log(logged_in_user);
                        req.flash("success", "Congratulations! Your account has been created. Please log in");
                        res.redirect("/auth/login");
                    })
                    .catch((error) => {
                        // res.redirect to something went wrong
                        res.json({
                            message: "An error occured!",
                        });
                    });
            }
        });
    });
});
// end of user registration

// Code for adding a book
// multer is used for image upload

import multer from "multer";
import fs from "fs";

// Provides disk storage for image uploads
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
});

var upload = multer({ storage: storage });

// Handles the posting of new password when user changes it
app.post("/changepassword", async (req, res, next) => {
    User.findOne({ username: req.body.username }, {}, {}, (err, user) => {
        if (err) {
            console.log("Well you're screwed");
        }
        if (!user) {
            console.log("No user");
        }
        bcrypt.compare(req.body.password1, user.password).then((isMatch) => {
            if (isMatch) {
                // old password matches!
                // hash new password
                console.log("match!");
                bcrypt.hash(req.body.password2, 10, function (err, hashedPass) {
                    console.log(hashedPass);
                    // finds the user by username and updates their password
                    const thisUser = User.findOneAndUpdate(
                        { username: req.body.username },
                        { password: hashedPass },
                        (err, data) => {
                            if (err) {
                                console.log("Well, you failed");
                            } else {
                                console.log(data);
                            }
                        }
                    );
                });
                res.redirect("/dashboard");
            } else {
                req.flash("flash", "Your old password is incorrect");
                res.redirect("/settings");
            }
        });
    });
});

// Route that handles the posting of book data to the database
app.post("/post-book", upload.single("image"), async (req, res, next) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    try {
        if (req.body.title === "" || req.body.author === "") {
            req.flash("flash", "Please enter title and author!");
            res.redirect("/addbook");
        } else if (req.body.description.length > 150) {
            req.flash("flash", "Description can only have 150 characters");
            fs.unlinkSync(`/public/uploads/${req.body.filename}`);
            res.redirect("/addbook");
        } else if (req.file.filename !== undefined) {
            const newBook = new Book({
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                genre: req.body.genre,
                in_wishlist: req.body.wishlist,
                filename: req.file.filename,
                img: {
                    data: req.file.filename,
                    contentType: req.file.mimetype,
                },
            });
            const thisUser = await User.findOne({ username: username_login });
            const data = new Book(newBook);
            thisUser.book_array.push(data);
            if (req.body.wishlist === "Yes") {
                thisUser.wishlist_array.push(data);
            }
            newBook.save();
            await thisUser
                .save()
                .then((res) => {
                    console.log("Saved");
                })
                .catch((err) => {
                    console.log("Error has occurred!");
                });
            res.redirect("/dashboard");
        }
    } catch (err) {
        req.flash("flash", "Please upload an image of the book!");
        res.redirect("/addbook");
    }
});
// End of add book

// Edit a book
app.post("/edit-book", upload.single("image"), async (req, res, next) => {
    try {
        if (req.body.title === "" || req.body.author === "") {
            req.flash("flash", "Please enter title and author!");
            res.redirect("/editbook?id=".concat(req.body.bookId));
        } else if (req.body.description.length > 150) {
            req.flash("flash", "Description can only have 150 characters");
            res.redirect("/editbook?id=".concat(req.body.bookId));
        } else if (req.file.filename !== undefined) {
            const update = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                genre: req.body.genre,
                filename: req.file.filename,
                img: {
                    data: req.file.filename,
                    contentType: req.file.mimetype,
                },
            };
            const thisBook = await Book.findByIdAndUpdate(req.body.bookId, update, { new: true });
            const thisUser = await User.updateOne(
                { username: username_login, "book_array._id": req.body.bookId },
                { $set: { "book_array.$": thisBook } }
            );
            res.redirect("/book?id=".concat(req.body.bookId));
        }
    } catch (err) {
        if (err instanceof TypeError && err.message == "Cannot read properties of undefined (reading 'filename')") {
            const update = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                genre: req.body.genre,
            };
            const thisBook = await Book.findByIdAndUpdate(req.body.bookId, update, { new: true });
            const thisUser = await User.updateOne(
                { username: username_login, "book_array._id": req.body.bookId },
                { $set: { "book_array.$": thisBook } }
            );
            res.redirect("/book?id=".concat(req.body.bookId));
        } else {
            console.log("An error has occurred!");
            console.log(err);
        }
    }
});
// End of edit book

// Adds a book to wishlist
app.post("/addtowishlist", async (req, res, next) => {
    try {
        const thisBook = await Book.findByIdAndUpdate(req.body.bookId, { in_wishlist: "Yes" }, { new: true });
        await User.updateOne(
            { username: username_login, "book_array._id": req.body.bookId },
            { $set: { "book_array.$": thisBook } }
        );
        await User.updateOne({ username: username_login }, { $push: { wishlist_array: thisBook } });
    } catch (err) {
        console.log(err);
    }
    res.redirect(`/book?id=${req.body.bookId}`);
});

// Removes a book from the wishlist
app.post("/removefromwishlist", async (req, res, next) => {
    try {
        const thisBook = await Book.findByIdAndUpdate(req.body.bookId, { in_wishlist: "No" }, { new: true });
        await User.updateOne(
            { username: username_login, "book_array._id": req.body.bookId },
            { $set: { "book_array.$": thisBook } }
        );
        await User.updateOne({ username: username_login }, { $pull: { wishlist_array: { _id: req.body.bookId } } });
    } catch (err) {
        console.log(err);
    }
    res.redirect(`/book?id=${req.body.bookId}`);
});

// Posting a comment
app.post("/post-comment", async (req, res, next) => {
    if (req.body.comments === "") {
        req.flash("flash", "Please enter note content before submitting");
        res.redirect(`/book?id=${req.body.bookId}`);
    } else {
        const comment = new Comment({
            made_by_user: req.body.made_by_user,
            header: req.body.header,
            content: req.body.comments,
        });
        const thisBook = await Book.findOne({ _id: req.body.bookId });
        const data = new Comment(comment);
        thisBook.comments.push(data);
        comment.save();
        await thisBook
            .save()
            .then((res) => {
                console.log("Saved");
            })
            .catch((err) => {
                console.log("Error has occurred!");
            });
        try {
            await User.updateOne(
                { username: username_login, "book_array._id": req.body.bookId },
                { $set: { "book_array.$": thisBook } }
            );
            if (thisBook.in_wishlist === "Yes") {
                await User.updateOne(
                    { username: username_login, "wishlist_array._id": req.body.bookId },
                    { $set: { "wishlist_array.$": thisBook } }
                );
            }
        } catch (err) {
            console.log(err);
        }
        res.redirect(`/book?id=${req.body.bookId}`);
    }
});

// For adding a friend

app.post("/send-request", async (req, res) => {
    const requestedFriend = req.body.requestedFriend;
    const thisUser = await User.findOne({ username: username_login });
    const requestedUser = await User.findOne({ _id: requestedFriend });
    const theUser = new User(requestedUser)
    const meUser = new User(thisUser)
    console.log(theUser)
    console.log(meUser)
    if (thisUser && requestedUser) {
        thisUser.friend_array_requests.push(theUser);
        requestedUser.friend_array_pending.push(meUser);
        await requestedUser
            .save()
            .then((res) => {
                console.log("Saved");
            })
            .catch((err) => {
                console.log("Error has occurred!");
            });
    }
    await thisUser
        .save()
        .then((res) => {
            console.log("Saved");
        })
        .catch((err) => {
            console.log(err);
        });
    req.flash("flash", `Request sent to ${requestedUser.username}!`);
    res.redirect('/dashboard')

})

app.post("/accept-request", async (req, res) => {
    // find user that requested
    const requestedUser = req.body.userrequestaccept
    const friendUser = await User.findOne({ username: requestedUser });
    // find current user
    const currentUser = await User.findOne({ username: username_login });
    console.log(req.body.userrequestaccept)
    console.log(username_login)

    // add requested user to the friend array of the current user and the user who requested (Works!)
    const friend_curr_user = new User(currentUser)
    const friend_req_user = new User(friendUser)
    console.log(friend_curr_user)
    console.log(friend_req_user)
    await User.findOneAndUpdate({ username: username_login }, { $push: { friend_array: friend_req_user } })
    await User.findOneAndUpdate({ username: requestedUser }, { $push: { friend_array: friend_curr_user } })
    // remove requested user from requests in currentUser (Does not work)
    await User.findOneAndUpdate({ username: username_login }, { $pull: { friend_array_requests: { username: friend_req_user.username } } }, { multi: true })
    // remove pending user from pending requests in friendUer (Does not work)
    await User.findOneAndUpdate({ username: requestedUser }, { $pull: { friend_array_pending: { username: friend_curr_user.username } } }, { multi: true })
    req.flash("flash", `Request by ${requestedUser} accepted!`);
    res.redirect('/dashboard')
})


app.listen(process.env.PORT || 3900 || "0.0.0.0", () => {
    console.log("running!");
});
