const { obtenerDatosDB_Hgi } = require("../Querys/Global_Querys");

const DeshabilitarTrigger = async (tabla) =>{
    try {
        let sql = `DISABLE TRIGGER TgHgiNet_${tabla} on ${tabla}`
        const rpta = await obtenerDatosDB_Hgi(sql);
        return rpta;
    } catch (error) {
        console.log("----------------------------ERROR------------------------")
        console.log(error);
        console.log("----------------------------ERROR------------------------")
        return false;
    }
}

module.exports = DeshabilitarTrigger