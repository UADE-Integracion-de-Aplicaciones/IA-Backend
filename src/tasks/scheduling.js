const schedule = require("node-schedule");
const executeMantenimientoCuentas = require("./mantenimiento_de_cuentas");
const { DEFAULTS } = require("../daos/common");

module.exports = () => {
  const cron_scheduling = DEFAULTS.CRON_EJECUCION_TAREAS;
  schedule.scheduleJob(cron_scheduling, executeMantenimientoCuentas);
};
