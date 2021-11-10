const nodemailer = require('nodemailer');

require('dotenv').config({path: 'variables.env'});

exports.testEmail = async (req, res) => {

    // let test = await nodemailer.createTestAccount();

    // console.log(req.body);

    // let transporter = nodemailer.createTransport({
    //     host: "smtp.hostinger.com",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //         user: "info@kozlohombres.com", // generated ethereal user
    //         pass: process.env.PASSOWORD_EMAIL, // generated ethereal password
    //     },
    // });

    // // send mail with defined transport object
    // let info = await transporter.sendMail({
    //     from: 'Kozlo <info@kozlohombres.com>', // sender address
    //     to: "darioe.barboza@gmail.com", // list of receivers
    //     subject: "Asunto enviado desde Kozlo-API", // Subject line
    //     text: "Mensaje enviado desde Kozlo-API", // plain text body
    // });

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.createContact = async (req, res, next) => {
    
    
}