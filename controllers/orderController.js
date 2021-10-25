const Shop = require('../models/Shop');

exports.getOrder = async (req, res, next) => {
    const id = req.params.id;
    try {
        let order = await Shop.findById(id);
        if(!order) {
            return res.status(401).json({message: 'Id de compra no válido'});
        }

        res.json({order, message: "Orden encontrada"});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Shop.find().sort("created");
        res.json({orders});
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}