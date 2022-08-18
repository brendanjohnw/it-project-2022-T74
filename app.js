// Listen for requests
import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import { mainRouter } from './routes/mainRouter.js';
import { authRouter } from './routes/auth.js'
import User from './models/User.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import flash from 'express-flash'


import bcrypt from 'bcryptjs'
const app = express();
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(cookieParser());
// Serve static content
// Database stuff
app.use(bodyParser.urlencoded({ extened: false }));
const connectionURL = 'mongodb+srv://brendanino:SVMd3nZJGKyfPJ4M@atlascluster.sbftbx6.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use('/auth', authRouter)
app.use('/', mainRouter);
app.use(flash());
app.use(authRouter)

export var logged_in_user = ""

// Registers a user for the app
app.post('/register', async (req, res) => {
    var username = req.body.username
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        User.countDocuments({ username: username }, function (err, count) {
            if (count > 0) {
                console.log('User already exists')
                res.redirect('/')

            } else if (err) {
                res.json({
                    error: err
                })
            } else {
                let user = new User({
                    username: req.body.username,
                    password: hashedPass
                })
                user.save()
                    .then(user => {
                        // res.redirect to the success page
                        logged_in_user = req.body.username
                        console.log(logged_in_user)
                        res.redirect('/auth/dashboard')
                    }).catch(error => {
                        // res.redirect to something went wrong
                        res.json({
                            message: "An error occured!"
                        })
                    })
            }
        })

    })
})

// end of user registration

app.listen(process.env.PORT || 3900 || '0.0.0.0', () => {
    console.log('running!');
});