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
                req.flash("flash", "User already exists");
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
                filename: req.file.filename,
                img: {
                    data: req.file.filename,
                    contentType: req.file.mimetype,
                },
                date_added: new Date().toLocaleString("en-US", options),
            });
            const thisUser = await User.findOne({ username: username_login });
            const data = new Book(newBook);
            thisUser.book_array.push(data);
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
            res.redirect("/dashboard");
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
            res.redirect("/dashboard");
        } else {
            console.log("An error has occurred!");
            console.log(err);
        }
    }
});
// End of edit book
// Posting a comment
app.post("/post-comment", async (req, res, next) => {
    if ((req.body.comments) === "") {
        req.flash("flash", "Please enter a comment before submitting");
    } else {
        const comment = new Comment({
            made_by: req.body.userId,
            made_by_user: req.body.username,
            header: req.body.header,
            content: req.body.comments
        })
        console.log(comment)
        const thisBook = await Book.findOne({ _id: req.body.bookId });
        console.log(req.body.bookId)
        const data = new Comment(comment)
        thisBook.comments.push(data)
        comment.save()
        await thisBook
            .save()
            .then((res) => {
                console.log("Saved");
            })
            .catch((err) => {
                console.log("Error has occurred!");
            });
        res.redirect(`/book?id=${req.body.bookId}`);

    }
})

app.listen(process.env.PORT || 3900 || "0.0.0.0", () => {
    console.log("running!");
});
