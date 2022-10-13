// Listen for requests
import express from "express";
import { create, engine } from "express-handlebars";
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

const app = express();

const hbs = create({
    extname: ".hbs",
    helpers: {
        isSingular: function (array) {
            if (array.length < 2) {
                return true;
            } else {
                return false;
            }
        },
    },
});
app.engine(".hbs", hbs.engine);
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
    const thisUser = await User.findOne({ username: username_login });
    const requestedUser = await User.findOne({ username: req.body.requestedFriend });
    if (requestedUser) {
        const in_friend = await User.exists({
            username: username_login,
            "friend_array.username": req.body.requestedFriend,
        });
        const in_request = await User.exists({
            username: username_login,
            "friend_array_requests.username": req.body.requestedFriend,
        });
        const in_pending = await User.exists({
            username: username_login,
            "friend_array_pending.username": req.body.requestedFriend,
        });
        if (in_friend) {
            req.flash("error", `'${requestedUser.username}' is already your friend!`);
        } else if (in_request) {
            req.flash("error", `You have sent a request to '${requestedUser.username}'!`);
        } else if (in_pending) {
            req.flash("error", `'${requestedUser.username}' has sent a reqeust to you! Please check`);
        } else {
            const sender = new User(thisUser);
            const receiver = new User(requestedUser);
            thisUser.friend_array_requests.push(receiver);
            requestedUser.friend_array_pending.push(sender);
            await thisUser.save().catch((err) => {
                console.log(err);
            });
            await requestedUser.save().catch((err) => {
                console.log(err);
            });
            req.flash("flash", `Request sent to '${requestedUser.username}'!`);
        }
    } else {
        req.flash("error", `Error! User '${req.body.requestedFriend}' does not exist!`);
    }
    res.redirect("/findfriends");
});

app.post("/accept-request", async (req, res) => {
    const currentUser = await User.findOne({ username: username_login });
    const friendUser = await User.findOne({ username: req.body.requesterName });
    await User.findOneAndUpdate({ username: username_login }, { $push: { friend_array: new User(friendUser) } });
    await User.findOneAndUpdate(
        { username: req.body.requesterName },
        { $push: { friend_array: new User(currentUser) } }
    );
    await User.findOneAndUpdate(
        { username: username_login },
        { $pull: { friend_array_pending: { username: req.body.requesterName } } },
        { multi: true }
    );
    await User.findOneAndUpdate(
        { username: req.body.requesterName },
        { $pull: { friend_array_requests: { username: username_login } } },
        { multi: true }
    );
    req.flash("flash", `Request by '${req.body.requesterName}' accepted!`);
    res.redirect("/findfriends");
});

app.post("/decline-request", async (req, res) => {
    await User.findOneAndUpdate(
        { username: username_login },
        { $pull: { friend_array_pending: { username: req.body.requesterName } } },
        { multi: true }
    );
    await User.findOneAndUpdate(
        { username: req.body.requesterName },
        { $pull: { friend_array_requests: { username: username_login } } },
        { multi: true }
    );
    req.flash("flash", `Request by '${req.body.requesterName}' declined!`);
    res.redirect("/findfriends");
});

app.post("/remove-friend", async (req, res) => {
    await User.findOneAndUpdate(
        { username: username_login },
        { $pull: { friend_array: { username: req.body.friendName } } },
        { multi: true }
    );
    await User.findOneAndUpdate(
        { username: req.body.friendName },
        { $pull: { friend_array: { username: username_login } } },
        { multi: true }
    );
    req.flash("flash", `You removed '${req.body.friendName}'.`);
    res.redirect("/findfriends");
});

app.post("/cancel-request", async (req, res) => {

    await User.findOneAndUpdate(
        { username: username_login },
        { $pull: { friend_array_requests: { username: req.body.receiverName } } },
        { multi: true }
    );
    await User.findOneAndUpdate(
        { username: req.body.receiverName },
        { $pull: { friend_array_pending: { username: username_login } } },
        { multi: true }
    );
    req.flash("flash", `Request to '${req.body.receiverName}' cancelled!`);
    res.redirect("/findfriends");
});

// Recommendations
app.post("/recommend-book", async (req, res) => {
    const to_friend = req.body.to_friend // username
    const recommended_book = req.body.book_id
    const book = await Book.findOne({ _id: recommended_book });
    console.log(recommended_book)
    var recommendedBook = new Book(book)
    // push book to friend's recommendation array
    await User.findOneAndUpdate({username: to_friend}, {$push: {recommendations: recommendedBook}} )
    req.flash("flash", `Recommended to ${to_friend}!`);
    res.redirect(`/book?id=${recommended_book}`)
    
})

app.listen(process.env.PORT || 3900 || "0.0.0.0", () => {
    console.log("running!");
});
