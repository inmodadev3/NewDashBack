const obtenerDatosDb_Dash = require('../../Querys/Global_Querys')
const { 
  GetClientes_Query, 
  GetClienteXIdentificacion_Query, 
  GetClienteXNombre_Query, 
  GetGestionesXCliente_Query, 
  GetDataClientes_dataClientes_Query, 
  GetDataClientes_dataGrafica_Query, 
  GetDataClientes_dataProductosMasComprados_Query, 
  PostNuevaGestion_Query, 
  obtenerCiudadesClientes_Query, 
  obtenerClientesXCiudad_Query
} = require('../../Querys/Portafolios_Querys')

const DASH = require('../../databases/DashConexion').dashConexion
const HGI = require('../../databases/HgiConexion').HgiConexion

//Obtener todos los clientes de la zonas correspondientes al vendedor
const GetClientes = async (req, res) => {
  const { vendedorId } = req.params

  try {
    let data = await GetClientes_Query(vendedorId)
    res.status(200).json({ data: data })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

//Obtener los clientes de las ciudades correspondientes al vendedor en base a un numero de itentificacion
const GetClienteXIdentificacion = async (req, res) => {
  const { clienteId, vendedorId } = req.body
  try {
    let data = await GetClienteXIdentificacion_Query(clienteId, vendedorId)
    res.status(200).json({ data: data })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

//Obtener los clientes de las ciudades correspondientes al vendedor en base a un nombre
const GetClienteXNombre = async (req, res) => {
  const { clienteNombre, vendedorId } = req.body
  try {
    let data = await GetClienteXNombre_Query(clienteNombre, vendedorId)
    res.status(200).json({ data: data })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

//Obtener las gestiones realizadas a un cliente basadas en su Id de tercero
const GetGestionesXCliente = async(req, res) => {
  const { id } = req.params
  
  try {
    const data = await GetGestionesXCliente_Query(id)
    res.status(200).json({ data: data })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

//Obtener detalles de cliente, informacion de lineas mas compradas e informacion de productos mas comprados
const GetDataClientes = async (req, res) => {
  const { id } = req.params
  
  let dataClientes = await GetDataClientes_dataClientes_Query(id)

  let dataGrafica = await GetDataClientes_dataGrafica_Query(id)

  let dataProductosMasComprados = await GetDataClientes_dataProductosMasComprados_Query(id)

  res.status(200).json({ data: dataClientes, grafica: dataGrafica, topComprados: dataProductosMasComprados })

}

//Insertar una nueva gestion 
const PostNuevaGestion = async(req, res) => {
  const {
    clienteId,
    intTipoGestion,
    intIdLogin,
    strObservacion
  } = req.body

    try {
      const data = await PostNuevaGestion_Query(clienteId,intTipoGestion,intIdLogin,strObservacion)
      res.status(200).json(data)
    } catch (error) {
      
    }
}

//Obtener y devolver las ciudades pertenecientes a cada vendedor
const obtenerCiudadesClientes = async (req, res) => {
  const { vendedorId } = req.body

  try {
    const obtenerCiudadesHgi = await obtenerCiudadesClientes_Query(vendedorId)
    res.status(200).json({ data: obtenerCiudadesHgi })
  } catch (error) {
    
  }
}

//Obtener clientes en base a una ciudad especifica
const obtenerClientesXCiudad = async (req, res) => {
  const { ciudadId } = req.body
  try {
    const clientes = await obtenerClientesXCiudad_Query(ciudadId)
    res.status(200).json({data:clientes})
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

module.exports = {
  GetClientes,
  GetClienteXIdentificacion,
  GetClienteXNombre,
  GetGestionesXCliente,
  PostNuevaGestion,
  GetDataClientes,
  obtenerCiudadesClientes,
  obtenerClientesXCiudad
}