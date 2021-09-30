const Tag = require('../models/Tag');

exports.createTag = async (req, res, next) => {
    
    try {
        let tag = await Tag.findOne({name: req.body.name});
        if(tag) {
            return res.status(401).json({message: 'Ya existe un tag con ese nombre.'});
        }
        
        tag = new Tag(req.body);
        await tag.save();
        res.json({tag, message: 'Tag creado correctamente.'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.getTags = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        res.json({tags});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}