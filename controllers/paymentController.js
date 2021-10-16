const mercadopago = require("mercadopago");
require('dotenv').config({ path: 'variables.env' });

exports.payment = async (req, res) => {

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

    console.log(req.body);

    mercadopago.configurations.setAccessToken(accessToken);
    const payment_data = {
        transaction_amount: Number(req.body.transaction_amount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.payment_method_id,
        issuer_id: req.body.issuer_id,
        payer: {
            email: req.body.payer.email,
            identification: {
                type: req.body.payer.identification.type,
                number: req.body.payer.identification.number
            }
        }
    };
    console.log('Payment Data');
    console.log(payment_data);


    // mercadopago.payment.save(payment_data)
    //     .then(function (response) {
    //         const { response: data } = response;
    //         console.log(data);
    //         res.status(response.status).json({
    //             status_detail: data.status_detail,
    //             status: data.status,
    //             id: data.id
    //         });
    //     })
    //     .catch(function (error) {
    //         res.status(error.status).send(error);
    //     });
    mercadopago.payment.save(payment_data)
        .then( response => {
            const {response: data} = response;
            // console.log(response);
            res.status(response.status).json({
                status_detail: data.status_detail,
                status: data.status,
                id: data.id
            });
        })
        .catch( (error) => {
            console.log(error);
            res.status(error.status).send(error);  
        })
}