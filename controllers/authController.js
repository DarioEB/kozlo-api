const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});


exports.authenticateUser = async (req, res, next) => {

    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        res.status(401).json({message: 'Los datos ingresados son incorrectos'});
        return next();
    }

    if(bcryptjs.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            user: user.surname,
            email: user.email,
            phone: user.phone,
            password: user.password,
            validation: user.validation,
            validated: user.validated,
            cart: user.cart,
            type: user.type,
            type: user.created
        }, process.env.SECRET, {
            expiresIn: '8h'
        });

        res.json({token});
    } else {
        res.status(401).json({message: 'Password incorrecto'});
        return next();
    }
}

exports.authenticatedUser = async (req, res, next) => {
    res.json({user: req.user});
}