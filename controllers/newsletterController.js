const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer')
require('dotenv').config({path: 'variables.env'});
exports.createNewsletter = async (req, res, next) => {
    const { email } = req.body;
    try {
        let news = await Newsletter.findOne({email});
        if(news){
            return res.status(401).json({message: 'El email ingresado ya fue registrado en Kozlo. Gracias por elegirnos.'});
        }
        news = new Newsletter(req.body);
        news.save();
        res.json({message: 'Usuario registrado en nuestro newsletter. Gracias por elegirnos'})
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Hubo un error, intenta nuevamente'})
    }
}

exports.emailNewsletter = async (req, res, next) => {
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
        to: req.body.email, // list of receivers
        subject: "Gracias suscribirte a nuestro Newsletter", // Subject line
        text: `
Hola, muchas gracias por suscribirte a nuestro newsletter, por este medio te notificaremos sobre ofertas de temporada, liquidaciones y nuevos ingresos. 

Gracias por elegirnos.
`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}