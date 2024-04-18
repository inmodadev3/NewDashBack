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
  obtenerClientesXCiudad_Query,
  GetCarteraClienteQuery,
  GetContactosCliente_Query,
  PutObservacion_Query
} = require('../../Querys/Panel/Portafolios_Querys')

//Obtener todos los clientes de la zonas correspondientes al vendedor
const GetClientes = async (req, res) => {
  const { vendedorId } = req.params
  const pagina = req.query.pag ? req.query.pag : 0
  try {
    let data = await GetClientes_Query(vendedorId, pagina)
    if (data == null) {
      res.status(204).json({ message: " No se han encontrado clientes asignados a las zonas" })
    } else {
      res.status(200).json({ data: data.datosClientes, pags: data.totalPaginas })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
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
  const pagina = req.query.pag ? req.query.pag : 0
  try {
    let data = await GetClienteXNombre_Query(clienteNombre, vendedorId, pagina)
    if (data == null) {
      res.status(204).json({ message: " No se han encontrado clientes asignados a las zonas" })
    } else {
      res.status(200).json({ data: data.datosClientes, pags: data.totalPaginas })
    }
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

//Obtener las gestiones realizadas a un cliente basadas en su Id de tercero
const GetGestionesXCliente = async (req, res) => {
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

  try {
    let dataClientes = await GetDataClientes_dataClientes_Query(id)

    let dataGrafica = await GetDataClientes_dataGrafica_Query(id)

    let GetCarteraCliente = await GetCarteraClienteQuery(id)

    let GetContactosCliente = await GetContactosCliente_Query(id)

    res.status(200).json({ data: dataClientes, grafica: dataGrafica, cartera: GetCarteraCliente, contactos:GetContactosCliente })
  } catch (error) {
    res.status(400).json({error:error.message})
  }



}

//Insertar una nueva gestion 
const PostNuevaGestion = async (req, res) => {
  const {
    clienteId,
    intTipoGestion,
    intIdLogin,
    strObservacion
  } = req.body

  try {
    const data = await PostNuevaGestion_Query(clienteId, intTipoGestion, intIdLogin, strObservacion)
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
  const { ciudadId, segmentoInt } = req.body
  const pagina = req.query.pag ? req.query.pag : 0
  try {
    const data = await obtenerClientesXCiudad_Query(ciudadId, segmentoInt, pagina)
    res.status(200).json({ data: data.datosClientes, pags: data.totalPaginas })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

//Actualizar observacion
const PutObservacion = async(req,res) =>{
  const { text,strIdCliente } = req.body
  
  if(String(strIdCliente).trim() == ""){
    res.status(406).json({error:"El id del cliente no puede estar vacio"})
  }
  
  try {
    await PutObservacion_Query(text, strIdCliente);
    res.status(200).json({message:"Actualizado correctamente"})
  } catch (error) {
    res.status(400).json({error:error})
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
  obtenerClientesXCiudad,
  PutObservacion
}