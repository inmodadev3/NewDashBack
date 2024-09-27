const poolDash = require('../databases/DashConexion');
const { poolHgi } = require('../databases/HgiConexion');


const obtenerDatosDb_Dash = async(query,params) =>{
    let conection;

    try {
        conection = await poolDash.promise().getConnection()
        const [rows] = await conection.query(query,params);
        return rows
    } catch (error) {
        throw error
    } finally {
        if (conection) {
            conection.release(); // Liberar la conexión de vuelta al pool
        }
    }
}

const obtenerDatosDB_Hgi = async (query) =>{
    let connection;
    try {
        // Conectar al pool de conexiones
        connection = poolHgi
        await connection.connect();

        // Realizar la consulta
        const result = await connection.query(query);
        return result.recordset; // Devuelve los resultados de la consulta
    } catch (error) {
        throw error;
    } finally {
        // Liberar la conexión de vuelta al pool
        if (connection) {
            connection.release();
        }
    }
}

const obtenerDatosDb_Dash_transaccion = async (connection, query, params) => {
    try {
        const [rows] = await connection.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error al obtener datos desde la base de datos:', error);
        throw error;
    }
}


module.exports = {obtenerDatosDb_Dash,obtenerDatosDB_Hgi,obtenerDatosDb_Dash_transaccion}