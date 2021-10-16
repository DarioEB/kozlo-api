const multer = require('multer');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {

    try {
        const categories = await Category.find();
        return res.json({categories});
    } catch (error) {
        console.log(error);
        res.status(550).send('Hubo un error');
    }
}

exports.createCategory = async (req, res, next) => {
    const configurationMulter = {
        limits: {fileSize: 10000000},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads/categories')
            },
            filename: (req, file, cb) => {
                const ext = file.mimetype.split('/')[1];
                cb(null, `${shortid.generate()}.${ext}`);
            }
        })
    }

    const upload = multer(configurationMulter).single('file');

    upload(req, res, async (error) => {
        if(!error) {
            let category = new Category();
            category.name = req.body.name;
            category.waists = req.body.waists;
            category.image = req.file.filename;
            
            try {
                await category.save();
                return res.json({category, message: 'Categoría guardada'});
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

exports.getImageFile = async (req, res) => {
    try {
        const file = req.params.image;
        const pathFile = `./uploads/categories/${file}`;
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