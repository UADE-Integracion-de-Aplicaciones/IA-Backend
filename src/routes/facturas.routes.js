const multer = require('multer');
const facturasController = require('../controllers/facturas.controller');

const upload = multer({dest: 'uploads/'});

module.exports = (app) => { 
    app.post('/facturas/cargar', upload.single('archivo'), (req,res) => facturasController.cargar(req,res));
    app.get('/facturas', (req,res) => facturasController.getFacturas(req, res));   
}


