

import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const register = (req, res, next) => {
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
}
export const getLogin = (req, res) => {
    res.render('login')
}

export const getRegister = (req, res) => {
    res.render('signup')
}
export const login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password
    User.findOne({username}).then(user => {
        if(user) {
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if (result) {
                    let token = jwt.sign({name: user.name}, 'verySecretValue', {expiresIn: '1h'})
                    res.json({
                        message: "Login Successful",
                        token
                    })
                }else{
                    res.json({
                        message: "Password does not exist"
                    })
                }
            })
        }else{
            res.json({
                message: "Password does not match"
            })
        }
    })
}

export default register
