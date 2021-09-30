const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const uuid = require('uuid');

exports.createUser = async (req, res, next) => {
    const { email, password} = req.body;
    let user = await User.findOne({email});
    if(user) {
        return res.status(401).json({message: 'Ya existe alguien registrado con este mail, por favor revise sus datos.'});
    }

    // Usuario no existe
    user = new User(req.body);
    user.validation = uuid.v4();
    // Hashear password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    try {
        await user.save(); // Guarda el usuario
        req.user = user;
        // res.json({message: 'Usuario registrado correctamente'});
        return res.json({user, message: 'Usuario creado correctamente.'})
        next();
    } catch ( error ) {
        res.status(500).json({message: 'Hubo un error'});
        console.log(error);
    }
}

exports.verificationEmail = async (req, res, next) => {
    const user = req.user;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: '2d.freelance.dev@gmail.com',
            pass: 'aibkupvlfyzwidja'
        }
    });
    try {
        const message = await transporter.sendMail({
            from: 'Kozlo <kozlo.com>',
            to: user.email,
            subject: `Verificación de cuenta en Kozlo`,
            text: `Hola ${user.name}, para terminar tu registro en Kozlo.com haz click en este link: http://192.168.100.218:3000/account/validation/${user.validation}`
        });
        console.log(message);
        res.status(200).json({message: `Se envió un mail a ${user.email} para verificar su cuenta.`, user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Hubo un error al enviar el E-mail'});
    }
}

exports.validationUser = async (req, res, next) => {
    
    const id = req.params.id;
    console.log(id);
    try {
        let user = await User.findOne({validation:id});
        if(!user) {
            res.status(400).json({message: 'Id incorrecto, ingrese nuevamente'});
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

exports.updateUser = async (req, res, next) => {
    const { 
        name, 
        email, 
        phone, 
        password, 
        validation, 
        validated, 
        shop_cart, 
        type
    } = req.user;
    const newUser = {};
    
    newUser.name = name;
    newUser.email = email;
    newUser.phone = phone;
    newUser.password = password;
    newUser.validation = validation;
    newUser.validated = validated;
    newUser.shop_cart = shop_cart;
    newUser.type = type;
    try {
        let user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        user = await User.findByIdAndUpdate({_id: req.params.id}, {$set: newUser}, {new: true});
        
        res.json({user});
    } catch (error) {
        console.log(error);
    }
}

