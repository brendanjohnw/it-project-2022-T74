import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

export var username_login;
// The following code handles the log in system for the app. I suggest we try to touch this as little as
// possible since the login code can break very easily if something is changed
passport.serializeUser((user, done) => {
    done(undefined, user._id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId, { passwordHash: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined);
        }
        return done(undefined, err);
    });
});

passport.use(
    new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, cb) => {
        username_login = username;
        console.log(username_login);
        User.findOne({ username }, {}, {}, (err, user) => {
            if (err) {
                return cb(undefined, false, {
                    message: 'Unknown error has occurred',
                });
            }
            if (!user) {
                return cb(undefined, false, {
                    message: 'Incorrect Password or Username',
                });
            }
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    return cb(null, user);
                }
                return cb(null, false, {
                    message: 'Incorrect Password or Username',
                });
            });
        });
    }),
);
export default passport;
