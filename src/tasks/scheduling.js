const schedule = require("node-schedule");
const ejecutarMantenimientoCuentas = require("./mantenimiento_de_cuentas");
const ejecutarCobroPorFondoDescubierto = require("./cobro_por_descubierto");
const ejecutarPagarPorDineroEnCuenta = require("./pagar_por_dinero_en_cuenta");
const { DEFAULTS } = require("../daos/common");

module.exports = () => {
  const cron_scheduling = DEFAULTS.CRON_EJECUCION_TAREAS;

  schedule.scheduleJob(cron_scheduling, ejecutarMantenimientoCuentas);
  schedule.scheduleJob(cron_scheduling, ejecutarCobroPorFondoDescubierto);
  schedule.scheduleJob(cron_scheduling, ejecutarPagarPorDineroEnCuenta);
};
