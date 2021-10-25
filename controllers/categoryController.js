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

exports.deleteCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        let category = await Category.findById(id);
        if(!category) {
            res.status(401).json({message: 'El Id no pertenece a ninguna categoría'});
        }

        req.category = category;
        await Category.findOneAndRemove(category._id);
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.deleteFileCategory = async (req, res, next) => {
    const category = req.category;
    try {
        // Verificando si existe el archivo en el servidor
        if (fs.existsSync(__dirname + `/../uploads/categories/${category.image}`)) {
            fs.unlinkSync(__dirname + `/../uploads/categories/${category.image}`);
            console.log(`Archivo ${category.image} eliminado`);
        }
        res.json({message: 'Categoría eliminada correctamente', category})
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}