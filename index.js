const express = require('express');
const connection = require('./config/db');
const cors = require('cors');
const app = express();
connection(); // Ejecutar la function de conexion
app.use(cors({credentials: true, origin: true})); //Cors
app.options("*", cors());
const port = process.env.PORT || 4000;
app.use(express.json({extended: true})); // Habilitar lectura de json

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});