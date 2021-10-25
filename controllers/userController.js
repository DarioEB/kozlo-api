const User = require('../models/User');
const Cart = require('../models/Cart');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
require('dotenv').config({path: 'variables.env'});
exports.newAccount = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({email});
    
        if(user) {
            return res.status(401).json({message: 'Ya existe alguien registrado con este mail, por favor revise sus datos.'});
        }
        const cart = new Cart();
        cart.save();
        // Usuario no existe
        user = new User(req.body);
        user.validation = uuid.v4();
        user.cart = cart._id;
        // Hashear password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        
        await user.save(); // Guarda el usuario
        req.user = user;
        // res.json({message: 'Usuario registrado correctamente'});
        res.json({user, message: 'Usuario creado correctamente.'});
        next();
    } catch ( error ) {
        res.status(500).json({message: 'Hubo un error'});
        console.log(error);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({users});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.emailVerification = async (req, res, next) => {
    const user = req.user;
    console.log('Email verification')
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "info@kozlohombres.com", // generated ethereal user
            pass: process.env.PASSWORD_EMAIL, // generated ethereal password
        },
    });
    
    let info = await transporter.sendMail({
        from: 'Kozlo <info@kozlohombres.com>', // sender address
        to: user.email, // list of receivers
        subject: "Verificación de cuenta en Kozlo", // Subject line
        text: `Hola ${user.name}, para terminar tu registro en kozlohombres.com haz click en este link: ${process.env.FRONEND_URL}/account/validation/${user.validation}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

// text: `Hola ${user.name}, para terminar tu registro en kozlohombres.com haz click en este link: http://192.168.100.218:3000/account/validation/${user.validation}`

exports.accountValidation = async (req, res, next) => {
    
    const id = req.params.id;
    try {
        let user = await User.findOne({validation:id});
        if(!user) {
            return res.status(401).json({message: 'Id incorrecto, ingrese nuevamente'});
        }
        user.validated = true;
        req.params.id = user._id;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.accountUpdate = async (req, res, next) => {
    const { 
        name, 
        surname,
        email, 
        phone, 
        password,
        shop_cart, 
        type
    } = req.user;
    const newUser = {};
    
    newUser.name = name;
    newUser.surname = surname;
    newUser.email = email;
    newUser.phone = phone;
    newUser.password = password;
    newUser.validation = '';
    newUser.validated = true;
    newUser.shop_cart = shop_cart;
    newUser.type = type;
    
    try {
        let user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        user = await User.findByIdAndUpdate({_id: req.params.id}, {$set: newUser}, {new: true});
        
        return res.json({user});
    } catch (error) {
        console.log(error);
    }
}

