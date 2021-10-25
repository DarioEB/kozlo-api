const multer = require('multer');
const fs = require('fs');
const path = require('path')
const shortid = require('shortid');
const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res, next) => {
    const configurationMulter = {
        limits: {fileSize: 10000000},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads/products')
            },
            filename: (req, file, cb) => {
                const ext = file.mimetype.split('/')[1];
                cb(null, `${shortid.generate()}.${ext}`);
            }
        })
    }

    const upload = multer(configurationMulter).array('file[]', 4);

    upload(req, res, async (error) => {
        
        if(!error) {
            let product = new Product();
            product.name = req.body.name;
            product.price = req.body.price;
            product.brand = req.body.brand;
            product.tags = req.body.tags;
            product.category = req.body.category;
            product.discount = req.body.discount;
            product.young = req.body.young;
            // Modifica el nombre de las imagenes dentro del producto
            req.files.forEach( (file, i) => {
                product.images[i] = file.filename
            });

            req.body.waists.forEach( (waist, i) => {
                product.waists[i] = {waist, stock: req.body.stock[i]}
            });
            
            
            try {
                await product.save();
                return res.json({product, message: 'Producto Almacenado'});
            } catch (error) {
                console.log(error);
                return res.status(500).send('Hubo un error');
            }

        } else {
            console.log(error);
            return next();
        }
    });

}

// Obtener imagen de un producto
exports.getProducts = async (req, res, next) => {

    try {
        const products = await Product.find({}).populate('category');
        res.json({products});
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }

}

// Extraer datos de un producto
exports.getProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(401).json({message: 'El product no existe'});
        }

        return res.json({product})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Imagen de un producto
exports.getImageFile = async (req, res) => {
    try {
        const file = req.params.image;
        const pathFile = `./uploads/products/${file}`;
        fs.exists(pathFile, (exists) => {
            if(exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(200).send('No existe la imagen');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    try {
        let product = await Product.findById(id);
        if(!product){
            res.status(401).json({message: 'El id no pertenece a ningún producto'});
        }

        req.product = product;
        await Product.findOneAndRemove(product._id);
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.deleteFilesProduct = async (req, res, next) => {
    const product = req.product;
    try {
        product.images.forEach(image => {
            // Verificando si existe el archivo en el servidor
            if (fs.existsSync(__dirname + `/../uploads/products/${image}`)) {
                fs.unlinkSync(__dirname + `/../uploads/products/${image}`);
            }
        });
        res.json({message: 'Producto eliminado correctamente', product});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

