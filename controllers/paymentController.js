const mercadopago = require("mercadopago");
const Shop = require('../models/Shop');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: 'variables.env' });
exports.payment = async (req, res, next) => {

    const publicAccessToken = process.env.PUBLIC_ACCESS_TOKEN;
    if (!publicAccessToken) {
        console.log("Error: public access token not defined");
        process.exit(1);
    }

    const accessToken = process.env.ACCESS_TOKEN;
    if (!accessToken) {
        console.log("Error: access token not defined");
        process.exit(1);
    }

    const { checkout, clientdata, cart, user } = req.body;

    // Datos del pago
    mercadopago.configurations.setAccessToken(accessToken);
    const payment_data = {
        transaction_amount: Number(checkout.transaction_amount),
        token: checkout.token,
        description: checkout.description,
        installments: Number(checkout.installments),
        payment_method_id: checkout.payment_method_id,
        issuer_id: checkout.issuer_id,
        payer: {
            email: checkout.payer.email,
            identification: {
                type: checkout.payer.identification.type,
                number: checkout.payer.identification.number
            }
        }
    };
    
    try {
        const mercadopagodata = await mercadopago.payment.save(payment_data);
        
        // Datos de orden
        let shop = new Shop();
        shop.id_payment_transaction = mercadopagodata.response.id;
        shop.status = 'Pagado';
        shop.status_transaction = mercadopagodata.response.status;
        shop.status_transaction_detail = mercadopagodata.response.status_detail;
        shop.order_products = cart.products;
        shop.subtotal = checkout.subtotal,
        shop.shipping_cost = checkout.shipping_cost;
        shop.total_cost = checkout.total_cost;
        shop.amount_transaction = checkout.transaction_amount;
        shop.client_name = clientdata.name;
        shop.client_lastname = clientdata.surname;
        shop.client_phone = clientdata.phone;
        shop.client_email = clientdata.email;
        shop.client_country = clientdata.country;
        shop.client_zip = clientdata.zip;
        shop.client_street = clientdata.street;
        shop.client_street_number = clientdata.number;
        shop.client_departament = clientdata.departament;
        shop.client_suburb = clientdata.suburb;
        shop.client_city = clientdata.city;
        shop.client_province = clientdata.province;
        shop.client_billing_information = clientdata.dnicuil
        
        // Si el usuario está registrado
        if(user) {    
            // Descontar carrito
            let cartId;

            // Si el usuario está registrado actualizamos el carrito a (vacio)
            cartId = cart._id;
            cartExists = await Cart.findById(cartId);
            if(cartExists) {
                let subtotal = 0;
                const newCart = {}

                newCart.subtotal = subtotal;
                newCart.products = [];
                newCart.created = cartExists.created;
                cartExists = await Cart.findOneAndUpdate({_id: cartId}, newCart, {new: true});
            }
            
            let userExists = await User.findById(user.id);
            // Relacionamos la compra con los datos del usuario
            const newUser = {};
            newUser.name = userExists.name;
            newUser.surname = userExists.surname;
            newUser.email = userExists.email;
            newUser.phone = userExists.phone;
            newUser.password = userExists.password;
            newUser.validation = userExists.validation;
            newUser.validated = userExists.validated;
            newUser.cart = userExists.cart;
            newUser.type = userExists.type;
            newUser.shops = userExists.shops;
            newUser.shops.push(shop._id);
            newUser.created = userExists.created;
            
            userExists = await User.findOneAndUpdate({_id: userExists._id}, newUser, {new: true});
        }   

        // Descontar stock
        cart.products.forEach( product => {
            updateStock(product);
        });

        await shop.save();
        req.shop = shop;
        res.status(mercadopagodata.status).json({ shop });
        next()
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al procesar el pago');
    }
}

// Función encargada de descontar stock
const updateStock = async (product) => {
    let productExists = await Product.findById(product._id);
    let newWaists = []
    productExists.waists.forEach( waist => {
        let ban = false;
        let newWaist = {}
        product.waists.forEach( w => {
            if(waist.waist === w.waist) {
                newWaist = {
                    waist: waist.waist,
                    stock: waist.stock - w.amount
                }
                ban = true
            }
        })
        if(!ban) {
            newWaist = waist;
        }
        newWaists.push(newWaist);
    });

    let newProduct = {}
    newProduct.name = productExists.name;
    newProduct.brand = productExists.brand;
    newProduct.price = productExists.price;
    newProduct.tags = productExists.tags;
    newProduct.category = productExists.category;
    newProduct.waists = newWaists;
    newProduct.images = productExists.images;
    newProduct.discount = productExists.discount;
    newProduct.young = productExists.young;
    newProduct.created = productExists.created;

    productExists = await Product.findOneAndUpdate({_id: product._id}, newProduct, {new: true});
        
}

exports.emailPaymentShop = async (req, res, next) => {

    const shop = req.shop;

    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "info@kozlohombres.com", // generated ethereal user
            pass: process.env.PASSWORD_EMAIL, // generated ethereal password
        },
    });

    let textProducts = ''
    shop.order_products.forEach( product => {
        textProducts += `${product.name}`
        product.waists.forEach( waist => {
            textProducts += ` Talle ${waist.waist} x ${waist.amount}`
        }) 
    })
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Kozlo <info@kozlohombres.com>', // sender address
        to: `${shop.client_email}`, // list of receivers
        subject: `Confirmación de pago de la compra #${shop._id}`, // Subject line
        text: `
Hola ${shop.client_name}, ¡recibimos tu pago!

¡Excelente! Confirmamos el pago por tu compra en Kozlo.

Tu código de compra Kozlo ${shop._id}

${textProducts}

Ya estamos preparando tu pedido para enviártelo. ¡Te vamos a avisar cuando esté en camino!

Datos de envío:
Dirección: ${shop.client_street} ${shop.client_street_number}
${shop.client_suburb !== '' ? `Barrio: ${shop.client_suburb}` : ''}
${shop.client_departament !== '' ? `Departamento: ${shop.client_departament}` : ''}
Ciudad: ${shop.client_city}
Código Postal: ${shop.client_zip}
País: ${shop.client_country}
Provincia/Estado: ${shop.client_province}

Podes ver el resumen y estado de tu compra en ${process.env.FRONTEND_URL}/order/${shop._id}

Gracias por elegirnos.
`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));23
}



    // mercadopago.payment.save(payment_data)
    //     .then( response => {
    //         const {response: data} = response;
    //         // console.log(response);
    //         res.status(response.status).json({
    //             status_detail: data.status_detail,
    //             status: data.status,
    //             id: data.id
    //         });
    //     })
    //     .catch( (error) => {
    //         console.log(error);
    //         res.status(error.status).send(error);  
    //     })