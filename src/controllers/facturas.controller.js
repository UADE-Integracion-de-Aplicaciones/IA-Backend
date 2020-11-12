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
     
    async getFacturas(req, res) {
        const { codigo_pago_electronico } = req.body;
        if (!codigo_pago_electronico || !req.body) {
            res.status(301).send("No se encuentran campos.");
            return ;
        }
        try {
            await facturasDao.getFacturaByCodigoPagoElectronico( codigo_pago_electronico )
                .then(factura => {
                    if (!factura) {
                        res.status(300).send("No se encontraron facturas");
                        return ;
                    }
                    res.status(200).send(factura);
                }).catch(err => {
                    console.log(err)
                    res.status(400).send("Error al buscar facturas, paso algo")
                })
        } catch (err) {
            res.status(500).json({ mensaje: "Error en el servidor al buscar factura" });
        }
    }
}