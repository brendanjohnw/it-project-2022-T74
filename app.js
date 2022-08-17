// Listen for requests
import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import Handlebars from 'handlebars';
import { mainRouter } from './routes/mainRouter.js';
import { authRouter } from './routes/auth.js'
import User from './models/User.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import { equal } from 'assert';
import register from './controllers/AuthController.js';

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const app = express();
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
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

app.post('/register', async (req, res) => {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }
        let user = new User({
            username: req.body.username,
            password: hashedPass
        })
        user.save()
            .then(user => {
                res.json({
                    message: "user successfully added!"
                })
            }).catch(error => {
                res.json({
                    message: "An error occured!"
                })
            })
    })
    res.redirect('/auth')
})


app.listen(process.env.PORT || 3200 || '0.0.0.0', () => {
    console.log('running!');
});