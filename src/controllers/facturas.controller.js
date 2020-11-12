const facturasDao = require('../daos/facturas.dao');
module.exports = {
 
    async cargar(req,res){
        const { path } = req.file;
        const { numero_cuenta } = req.body;
        var columns = true; 
        try {
            await facturasDao.cargarFacturas(path, numero_cuenta, columns);
            res.status(200).json({ mensaje: "Facturas cargadas" });
        }catch (err) {
            res.status(400).json({ mensaje: err });
        }
    },
     
}