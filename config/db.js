const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

// Conexion
const connection = async () => {
    try {
        await mongoose.connect( process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Base de datos conectada');
    } catch (error) {
        console.log('Hubo un error al conectar la bd');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connection;