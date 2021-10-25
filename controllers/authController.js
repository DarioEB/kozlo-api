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

    if(user.validation !== '') {
        res.status(401).json({message: 'Esta cuenta todavía no ha sido verificada. Revise su correo eletrónico para poder verificar su cuenta.'})
        return next();
    }

    if(bcryptjs.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            password: user.password,
            validation: user.validation,
            validated: user.validated,
            cart: user.cart,
            type: user.type,
            shops: user.shops,
            created: user.created
        }, process.env.SECRET, {
            expiresIn: '8h'
        });

        res.json({token, message: "Datos ingresados correctos"});
    } else {
        res.status(401).json({message: 'Datos ingresados correctos'});
        return next();
    }
}

exports.authenticatedUser = async (req, res, next) => {
    res.json({user: req.user});
}