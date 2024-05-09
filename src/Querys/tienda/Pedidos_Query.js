const poolDash = require('../../databases/DashConexion');
const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('../Global_Querys')

const Obtener_id_pedido_activo_cliente = (idCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtener_id_pedido_query = `SELECT intIdPedido FROM tblpedidostienda WHERE strIdCliente = ? AND intEstado = 1`;
            const obtener_id_pedido = await obtenerDatosDb_Dash(obtener_id_pedido_query, [idCliente]);
            resolve(obtener_id_pedido)
        } catch (error) {
            reject(error)
        }
    })
}

const Obtener_Telefono_Vendedor_Query = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `Select strTelefonoVendedor from tblLogin where idLogin = ?`
            const data = await obtenerDatosDb_Dash(query, [id])
            resolve(data[0].strTelefonoVendedor)
        } catch (error) {
            reject(error)
        }
    })
}


const Crear_Pedido_Query = (Idvendedor, cliente) => {
    return new Promise(async (resolve, reject) => {

        const { strIdCliente, strNombreCliente } = cliente

        try {
            const query_Ciudad_Tercero = `select ciudades.StrDescripcion as ciudad from TblTerceros as terceros
            inner join TblCiudades as ciudades on terceros.StrCiudad = ciudades.StrIdCiudad
            where terceros.StrIdTercero = '${strIdCliente}'`

            const query_Info_Vendedor = `select strNombreEmpleado as nombre, strIdVendedor from tbllogin where idLogin = ?`

            const ciudad = await obtenerDatosDB_Hgi(query_Ciudad_Tercero)
            const vendedor = await obtenerDatosDb_Dash(query_Info_Vendedor, [Idvendedor])

            const query = `INSERT INTO 
            tblpedidostienda (
                strIdVendedor,
                strNombVendedor,
                StrIdCliente,
                StrNombCliente,
                StrCiudadCliente,
                intValorTotal,
                dtFechaInicio,
                intEstado
            )VALUES (
                ?,?,?,?,?,?,?,?
            )`

            await obtenerDatosDb_Dash(query, [
                vendedor[0].strIdVendedor,
                vendedor[0].nombre,
                strIdCliente,
                strNombreCliente,
                ciudad[0].ciudad,
                0,
                new Date(),
                1
            ])

            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Agregar_productos_Query = (Idvendedor, clienteData, productoData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validar_pedido_Query = `Select intIdPedido from tblpedidostienda where strIdCliente = ? and intEstado = 1`
            const validar_Pedido = await obtenerDatosDb_Dash(validar_pedido_Query, [clienteData.strIdCliente])
            //VALIDAR EXISTENCIA DE ALGUN PEDIDO Y VALIDAR QUE SEA UN PEDIDO EN PROCESO EN ESTADO 1

            if (validar_Pedido.length === 0) {
                await Crear_Pedido_Query(Idvendedor, clienteData)
            }

            // Obtener el ID del pedido activo
            const obtener_id_pedido_query = `SELECT intIdPedido FROM tblpedidostienda WHERE strIdCliente = ? AND intEstado = 1`;
            const obtener_id_pedido = await obtenerDatosDb_Dash(obtener_id_pedido_query, [clienteData.strIdCliente]);

            if (obtener_id_pedido.length > 0) {
                const idPedidoActivo = obtener_id_pedido[0].intIdPedido;

                const agregar_productos_Query = `INSERT INTO
                tbldetallepedidostienda (
                    intIdPedido,
                    strIdProducto,
                    strDescripcion,
                    intCantidad,
                    StrUnidadMedida,
                    StrObservacion,
                    intPrecio,
                    strRutaImg
                )VALUES(
                    ?,?,?,?,?,?,?,?
                )`

                await obtenerDatosDb_Dash(agregar_productos_Query, [
                    idPedidoActivo,
                    productoData.strIdProducto,
                    productoData.strDescripcion,
                    productoData.intCantidad,
                    productoData.strUnidadMedida,
                    productoData.strObservacion,
                    productoData.intPrecio,
                    productoData.strRutaImg
                ])

                await Actualizar_total_pedido_Query(idPedidoActivo)
                resolve(1)

            } else {
                reject("No se pudo obtener el ID del pedido activo.")
            }

        } catch (error) {
            reject(error)
        }
    })
}

const Actualizar_Cantidad_Observacion_Producto_Query = (cantidad, observacion, id, strIdCliente) => {
    return new Promise(async (resolve, reject) => {
        try {

            const obtener_id_pedido = await Obtener_id_pedido_activo_cliente(strIdCliente);

            if (obtener_id_pedido.length > 0) {
                const idPedidoActivo = obtener_id_pedido[0].intIdPedido;
                const query = `UPDATE tbldetallepedidostienda SET intCantidad = ? , strObservacion = ? where intIdPedDetalle = ?`
                await obtenerDatosDb_Dash(query, [cantidad, observacion, id])
                await Actualizar_total_pedido_Query(idPedidoActivo);
                resolve(1)
            }



        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_CantidadProductos_Pedido_Query = (strIdCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtener_id_pedido_query = `SELECT intIdPedido FROM tblpedidostienda WHERE strIdCliente = ? AND intEstado = 1`;
            const obtener_id_pedido = await obtenerDatosDb_Dash(obtener_id_pedido_query, [strIdCliente]);

            const obtener_cantidad_productos_Query = `SELECT COUNT(*) as total_productos FROM tbldetallepedidostienda where intIdPedido = ? AND intEstado = 1`
            if (obtener_id_pedido.length > 0) {
                const obtener_cantidad_productos = await obtenerDatosDb_Dash(obtener_cantidad_productos_Query, [obtener_id_pedido[0].intIdPedido])
                resolve(obtener_cantidad_productos[0].total_productos)
            } else {
                resolve(0)
            }

        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Producto_Agregado_Query = (strIdCliente, strIdProducto) => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtener_id_pedido_query = `SELECT intIdPedido FROM tblpedidostienda WHERE strIdCliente = ? AND intEstado = 1`;
            const obtener_id_pedido = await obtenerDatosDb_Dash(obtener_id_pedido_query, [strIdCliente]);

            const query = `select intIdPedDetalle as id, intCantidad, strObservacion from tbldetallepedidostienda where intIdPedido = ? and strIdProducto = ? and intEstado = 1`

            const data = await obtenerDatosDb_Dash(query, [obtener_id_pedido[0].intIdPedido, strIdProducto])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Eliminar_Producto_query = (id, strIdCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtener_id_pedido = await Obtener_id_pedido_activo_cliente(strIdCliente);


            if (obtener_id_pedido.length > 0) {
                const idPedidoActivo = obtener_id_pedido[0].intIdPedido;
                const query = `UPDATE tbldetallepedidostienda set intEstado = -1 where intIdPedDetalle = ?`
                await obtenerDatosDb_Dash(query, [id])
                await Actualizar_total_pedido_Query(idPedidoActivo);
                resolve(1)
            }


        } catch (error) {
            reject(error)
        }
    })
}

const Eliminar_TodosLosProductos_Query = (id, strIdCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtener_id_pedido = await Obtener_id_pedido_activo_cliente(strIdCliente);

            if (obtener_id_pedido.length > 0) {
                const idPedidoActivo = obtener_id_pedido[0].intIdPedido;
                const query = `UPDATE tbldetallepedidostienda set intEstado = -1 where intIdPedido = ?`
                await obtenerDatosDb_Dash(query, [id])
                await Actualizar_total_pedido_Query(idPedidoActivo);
                resolve(1)
            }

        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Productos_Query = (strIdCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtener_id_pedido_query = `SELECT intIdPedido FROM tblpedidostienda WHERE strIdCliente = ? AND intEstado = 1`;
            const obtener_id_pedido = await obtenerDatosDb_Dash(obtener_id_pedido_query, [strIdCliente]);


            const query = `SELECT 
                intIdPedDetalle as id,
                intIdPedido as pedidoId,
                strIdProducto as referencia,
                strRutaImg as imagen,
                strDescripcion as descripcion,
                intPrecio as precio, 
                intCantidad as cantidad, 
                (intPrecio * intCantidad) as subTotal 
            FROM 
                tbldetallepedidostienda 
            WHERE 
                intIdPedido = ?
            AND 
                intEstado = 1;`
            const data = await obtenerDatosDb_Dash(query, [obtener_id_pedido[0].intIdPedido])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Datos_Cliente_Query = (StrIdTercero) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT 
            T.StrNombre1,
            T.StrNombre2,
            T.StrApellido1,
            T.StrApellido2,
            T.StrIdTercero,
            T.StrDireccion,
            C.StrDescripcion as ciudad,
            Z.StrDescripcion as Depto,
            T.StrTelefono
            FROM tblTerceros as T
            INNER JOIN TblCiudades as C on T.StrCiudad = C.StrIdCiudad
            INNER JOIN TblZonas as Z on Z.StrIdZona = C.StrZona
            where StrIdTercero = '${StrIdTercero}'`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Validar_Agotados_Pedido_Query = (arrProductos) => {
    return new Promise(async (resolve, reject) => {
        try {
            const referenciasIdArr = []

            for (const producto of arrProductos) {
                referenciasIdArr.push((producto.referencia).toString())
            }

            const referenciasString = referenciasIdArr.map((producto) => `'${producto}'`).join(', ');

            const query = `select StrIdProducto from tblProductos where intHabilitarProd != 1 and strIdProducto in (${referenciasString})`
            const agotados = await obtenerDatosDB_Hgi(query)

            const agotadosArr = []

            for (const producto of arrProductos) {
                for (const agotado of agotados) {
                    if (producto.referencia.toString().toUpperCase() == agotado.StrIdProducto.toString().toUpperCase()) {
                        agotadosArr.push({
                            id: producto.id,
                            pedidoId: producto.pedidoId,
                            referencia: producto.referencia,
                            imagen: producto.imagen,
                            descripcion: producto.descripcion,
                            precio: producto.precio,
                            cantidad: producto.cantidad,
                            subTotal: producto.subTotal
                        })
                    }
                }
            }

            resolve(agotadosArr)
        } catch (error) {
            reject(error)
        }
    })
}

const Validar_Precios_Pedido_Query = (arrProductos, strIdCliente, precio) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tipo_tercero_query = `select TT.IntPrecio from TblTerceros as T INNER JOIN TblTiposTercero as TT on T.IntTipoTercero = TT.IntIdTipoTercero where T.StrIdTercero = '${strIdCliente}'`
            const tipo_tercero = await obtenerDatosDB_Hgi(tipo_tercero_query)

            const referenciasIdArr = []
            for (const producto of arrProductos) {
                referenciasIdArr.push((producto.referencia).toString())
            }
            const referenciasString = referenciasIdArr.map((producto) => `'${producto}'`).join(', ');


            const query = `select StrIdProducto,intPrecio${(precio == null && strIdCliente) ? tipo_tercero[0].IntPrecio : precio} as precio from TblProductos where strIdProducto in (${referenciasString}) and intHabilitarProd = 1`
            const productos = await obtenerDatosDB_Hgi(query)

            const cambios_precioArr = []
            for (const producto of arrProductos) {
                for (const Producto_cambio of productos) {
                    if (producto.referencia.toString().toUpperCase() == Producto_cambio.StrIdProducto.toString().toUpperCase()) {
                        if (producto.precio !== Producto_cambio.precio) {
                            cambios_precioArr.push({
                                id: producto.id,
                                pedidoId: producto.pedidoId,
                                referencia: producto.referencia,
                                imagen: producto.imagen,
                                descripcion: producto.descripcion,
                                precio_anterior: producto.precio,
                                precio_actual: Producto_cambio.precio,
                                cantidad: producto.cantidad,
                                subTotal: producto.subTotal
                            })
                        }
                    }
                }
            }

            resolve(cambios_precioArr)
        } catch (error) {
            reject(error)
        }
    })
}

const Actualizar_Agotados_Pedido_Query = (arrProductos) => {
    return new Promise(async (resolve, reject) => {
        try {
            const referenciasIdArr = []

            for (const producto of arrProductos) {
                referenciasIdArr.push((producto.id).toString())
            }

            const referenciasString = referenciasIdArr.map((producto) => `${producto}`).join(', ');

            const query = `UPDATE tbldetallepedidostienda SET intEstado = -1 where intIdPedDetalle in (?)`
            await obtenerDatosDb_Dash(query, [referenciasString])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Actualizar_Cambios_Precios_Pedido_Query = (arrProductos) => {
    return new Promise(async (resolve, reject) => {
        try {

            for (const producto of arrProductos) {
                const query = `UPDATE tbldetallepedidostienda SET intPrecio = ? where intIdPedDetalle = ?`
                await obtenerDatosDb_Dash(query, [producto.precio_actual, producto.id])
            }

            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Actualizar_total_pedido_Query = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select intPrecio as precio, intCantidad as cantidad from tbldetallepedidostienda where intIdPedido = ? and intEstado = 1`
            const data = await obtenerDatosDb_Dash(query, [id])
            let total = 0;

            for (const item of data) {
                total += parseInt(item.precio) * parseInt(item.cantidad)
            }

            const actulizar_tota_query = `UPDATE tblpedidostienda SET intValorTotal = ? where intIdPedido = ?`
            await obtenerDatosDb_Dash(actulizar_tota_query, [total, id])

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}


const Enviar_pedido_Database_Query = async (strIdCliente, strObservacion, seller) => {
    let connection; // Obtener la conexión

    try {
        connection = await poolDash.promise().getConnection()
        await connection.beginTransaction(); // Iniciar la transacción

        const obtener_id_pedido = await Obtener_id_pedido_activo_cliente(strIdCliente);
        const fecha = new Date();

        const query_pedido = `UPDATE tblpedidostienda SET intEstado = 2, dtFechaEnvio = ?, strObservacion = ? WHERE intIdPedido = ?`;
        const data_pedido_query = `SELECT * FROM tblpedidostienda WHERE intIdPedido = ?`;

        if (obtener_id_pedido.length > 0) {
            const idPedidoActivo = obtener_id_pedido[0].intIdPedido;
            const esperar = await Actualizar_total_pedido_Query(idPedidoActivo);

            if (esperar) {
                //DESACTIVAR PEDIDO ACTIVO DE LA TIENDA
                await connection.query(query_pedido, [fecha, strObservacion, idPedidoActivo]);

                //PASAR PEDIDO A LA TABLA DE PEDIDOS DE INMODA
                const data = await obtenerDatosDb_Dash(data_pedido_query, [idPedidoActivo]);
                const lastId = await Enviar_pedido_tblPedidos(
                    data[0].intIdPedido,
                    data[0].strIdVendedor,
                    data[0].strNombVendedor,
                    data[0].strIdCliente,
                    data[0].strNombCliente,
                    data[0].strCiudadCliente,
                    data[0].intValorTotal,
                    data[0].dtFechaEnvio,
                    strObservacion,
                    data[0].strCorreoClienteAct,
                    data[0].strCelularClienteAct,
                    data[0].strCiudadClienteAct,
                    seller
                );

                //PASAR LOS PRODUCTOS DEL PEDIDO WEB AL PEDIDO GENERAL
                const query = `SELECT 
                    intIdPedDetalle as id,
                    intIdPedido as pedidoId,
                    strIdProducto as referencia,
                    strRutaImg as imagen,
                    strDescripcion as descripcion,
                    intPrecio as precio, 
                    intCantidad as cantidad, 
                    strUnidadMedida as unidad,
                    strObservacion as observacion
                FROM 
                    tbldetallepedidostienda 
                WHERE 
                    intIdPedido = ?
                AND 
                    intEstado = 1;`;

                const [rows] = await connection.query(query, [idPedidoActivo]);
                const lastIdQuery = `SELECT COALESCE((SELECT MAX(intIdPedDetalle) FROM dash.tbldetallepedidos), 0) as ultimoID;
                `

                const insertar_producto_Query = `INSERT INTO tbldetallepedidos (
                    intIdPedDetalle,
                    intIdPedido,
                    strIdProducto,
                    strDescripcion,
                    intCantidad,
                    strUnidadMedida,
                    strObservacion,
                    intPrecio,
                    intPrecioProducto,
                    intEstado
                )VALUES(
                    ?,?,?,?,?,?,?,?,?,?
                )`;


                for (const item of rows) {
                    const lastIdDet = await obtenerDatosDb_Dash(lastIdQuery);
                    const nuevoIdDetalle = lastIdDet[0].ultimoID + 1;

                    await obtenerDatosDb_Dash(insertar_producto_Query, [
                        nuevoIdDetalle,
                        lastId,
                        item.referencia,
                        item.descripcion,
                        item.cantidad,
                        item.unidad,
                        item.observacion,
                        item.precio,
                        item.precio,
                        1
                    ]);
                }
                await connection.commit(); // Confirmar la transacción

                const obtener_total_Query = `SELECT intValorTotal FROM tblpedidos where intIdPedido = ?`
                const total_pedido = await obtenerDatosDb_Dash(obtener_total_Query,[lastId])
                const total = total_pedido[0].intValorTotal

                return {lastId,total};
            }
        } else {
            throw new Error("NO SE ENCUENTRA NINGUN PEDIDO INICIADO");
        }
    } catch (error) {
        await connection.rollback(); // Revertir la transacción en caso de error
        throw error;
    } finally {
        connection.release(); // Liberar la conexión al final, independientemente de si hay un error o no
    }
};


const Enviar_Pedido_Local_Query = (
    intIdPedido,
    Idvendedor,
    strIdCliente,
    strNombCliente,
    strCiudadCliente,
    intValorTotal,
    dtFechaEnvio,
    strObservacion,
    strCorreoClienteAct,
    strCelularClienteAct,
    strCiudadClienteAct,
    seller,
    arrProductos,
    precioTienda
) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {

            connection = await poolDash.promise().getConnection();
            await connection.beginTransaction();

            const query_Info_Vendedor = `select strNombreEmpleado as nombre, strIdVendedor from tbllogin where idLogin = ?`
            const vendedor = await obtenerDatosDb_Dash(query_Info_Vendedor, [Idvendedor])


            const lastId = await Enviar_pedido_tblPedidos(
                intIdPedido,
                vendedor[0].strIdVendedor,
                vendedor[0].nombre,
                strIdCliente,
                strNombCliente,
                strCiudadCliente,
                intValorTotal,
                dtFechaEnvio,
                strObservacion,
                strCorreoClienteAct,
                strCelularClienteAct,
                strCiudadClienteAct,
                seller,
                precioTienda
            )

            const lastIdQuery = `SELECT COALESCE((SELECT MAX(intIdPedDetalle) FROM dash.tbldetallepedidos), 0) as ultimoID`


            const insertar_producto_Query = `INSERT INTO tbldetallepedidos (
                intIdPedDetalle,
                intIdPedido,
                strIdProducto,
                strDescripcion,
                intCantidad,
                strUnidadMedida,
                strObservacion,
                intPrecio,
                intPrecioProducto,
                intEstado
            )VALUES(
                ?,?,?,?,?,?,?,?,?,?
            )`;

            for (const item of arrProductos) {
                const lastIdDet = await obtenerDatosDb_Dash(lastIdQuery);
                const nuevoIdDetalle = lastIdDet[0].ultimoID + 1;

                await obtenerDatosDb_Dash(insertar_producto_Query, [
                    nuevoIdDetalle,
                    lastId,
                    item.referencia,
                    item.descripcion,
                    item.cantidad,
                    item.unidad,
                    item.observacion,
                    item.precio,
                    item.precio,
                    1
                ]);
            }

            await connection.commit()
            resolve(lastId)
        } catch (error) {
            await connection.rollback();
            resolve(reject)
        } finally {
            connection.release();
        }
    })
}

const Enviar_pedido_tblPedidos = async (
    intIdPedido,
    strIdVendedor,
    strNombVendedor,
    strIdCliente,
    strNombCliente,
    strCiudadCliente,
    intValorTotal,
    dtFechaEnvio,
    strObservacion,
    strCorreoClienteAct,
    strCelularClienteAct,
    strCiudadClienteAct,
    seller,
    precioTienda
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const insert_nuevoPedido_Query = `INSERT INTO tblpedidos (
                intIdPedido,
                strIdPedidoVendedor,
                strIdVendedor,
                strNombVendedor,
                strIdCliente,
                strNombCliente,
                strCiudadCliente,
                intValorTotal,
                dtFechaEnvio,
                strObservacion,
                strCorreoClienteAct,
                strCelularClienteAct,
                strCiudadClienteAct,
                intEstado,
                intIdLogin,
                blEspera
            ) VALUES (
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            )`

            const lastIdQuery = `SELECT MAX(intIdPedido) as ultimoID FROM tblpedidos`
            const lastIdRow = await obtenerDatosDb_Dash(lastIdQuery)
            const lastId = lastIdRow[0].ultimoID + 1

            await obtenerDatosDb_Dash(insert_nuevoPedido_Query, [
                lastId ? lastId : 0,
                intIdPedido,
                strIdVendedor,
                strNombVendedor,
                strIdCliente,
                strNombCliente,
                strCiudadCliente,
                intValorTotal,
                new Date(),
                strObservacion,
                strCorreoClienteAct,
                strCelularClienteAct,
                strCiudadClienteAct,
                1,
                seller,
                precioTienda
            ])

            resolve(lastId)
        } catch (error) {
            reject(error)
        }
    })
}

const cambiar_estado_pedidosTienda_Query = async(estado,idPedido)=> {
    return new Promise(async(resolve, reject) => {
        try {
            const query_pedido = `UPDATE tblpedidostienda SET intEstado = ? WHERE intIdPedido = ?`;
            await obtenerDatosDb_Dash(query_pedido,[estado,idPedido])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    Crear_Pedido_Query,
    Agregar_productos_Query,
    Actualizar_Cantidad_Observacion_Producto_Query,
    Consultar_CantidadProductos_Pedido_Query,
    Consultar_Producto_Agregado_Query,
    Eliminar_Producto_query,
    Eliminar_TodosLosProductos_Query,
    Consultar_Productos_Query,
    Consultar_Datos_Cliente_Query,
    Validar_Agotados_Pedido_Query,
    Validar_Precios_Pedido_Query,
    Actualizar_Agotados_Pedido_Query,
    Actualizar_Cambios_Precios_Pedido_Query,
    Actualizar_total_pedido_Query,
    Enviar_pedido_Database_Query,
    Obtener_Telefono_Vendedor_Query,
    Enviar_Pedido_Local_Query,
    cambiar_estado_pedidosTienda_Query
}