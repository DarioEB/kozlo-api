const Cart = require('../models/Cart');
const Product = require('../models/Product');
require('dotenv').config({path: 'variables.env'});

exports.createCart = async (req, res, next) => {
    try {
        const cart = new Cart();
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.getCart = async (req, res, next) => {
    const  id = req.params.id;

    try {
        let cart = await Cart.findById(id);
        if(!cart) {
            return res.status(401).json({message: 'El id de carrito es incorrecto'});
        }

        res.json({cart});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.addProductToCart = async (req, res, next) => {
    const id = req.params.id;
    try {
        let cart = await Cart.findById(id);

        if(!cart) {
            return res.status(401).json({message: 'El id de carrito es incorrecto'});
        }
        let subtotal = cart.subtotal;
        const newCart = {}

        const product = new Product(req.body);
        
        product.waists.forEach( waist => {
            subtotal += (product.price - (product.price * (product.discount / 100))) * waist.amount   
        });

        newCart.subtotal = subtotal;
        newCart.products = cart.products;
        newCart.products.push(product);
        newCart.created = cart.created;

        cart = await Cart.findOneAndUpdate({_id: cart._id}, newCart, {new: true});
        res.json({cart, product});
    } catch (error) {
        console.log(error);
    }
}

exports.removeProductToCart = async (req, res, next) => {
    const { products, created } = req.body;
    try {
        let cart;
        cart = await Cart.findById(req.params.id);
        if(!cart) {
            return res.status(401).json({message: 'El id de carriro es incorrecto'});
        }
        let subtotal = 0
        const newCart = {}
        
        req.body.products.forEach( product => {
            product.waists.forEach( waist => {
                subtotal += (product.price - (product.price * (product.discount / 100))) * waist.amount
            })
        });

        newCart.subtotal = subtotal;
        newCart.products = products;
        newCart.created = created;
        
        cart = await Cart.findOneAndUpdate({_id: req.params.id}, newCart, {new: true});
        return res.json({cart});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}