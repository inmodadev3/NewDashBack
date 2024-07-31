const {
    GetProductos_Query,
    GetProductosXlinea_Query,
    GetProductosXGrupos_Query,
    GetProductosXTipos_Query,
    GetProductoXid_Query,
    GetImagesXid_Query,
    ContarProductosXClase_Query,
    ContarProductosXLineas_Query,
    ContarProductosXGrupos_Query,
    ContarProductos_Query,
    ContarProductosXTipos_Query,
    Buscar_Productos_Query,
    Contar_Productos_Busqueda_Query,
    BuscarProductosSimilares_Query,
    ObtenerRecomendaciones_Query,
    ProductoMasVendidosUltimoMes_Query
} = require('../../Querys/tienda/Productos_Querys')

//OBTENER TODOS LOS PRODUCTOS O POR CLASE
const GetProductos = async (req, res) => {
    const pagina = req.query.pag ? parseInt(req.query.pag) : 0
    let filtro = (req.query.sort && req.query.sort !== undefined) ? req.query.sort : 'recent'
    const cantidadReg = 30
    const skipReg = pagina * cantidadReg
    const clase = req.query.class

    try {
        const data = await GetProductos_Query(clase, skipReg, cantidadReg, filtro)
        res.status(200).json({ success: true, data: data })

    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener los productos" })
    }
}

//OBTENER PRODUCTOS POR LINEAS
const GetProductosXlinea = async (req, res) => {
    const pagina = req.query.pag ? req.query.pag : 0
    let filtro = (req.query.sort && req.query.sort !== undefined) ? req.query.sort : 'recent'
    const cantidadReg = 30
    const skipReg = pagina * cantidadReg
    const { lineas } = req.body

    try {
        const data = await GetProductosXlinea_Query(lineas, skipReg, cantidadReg, filtro)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener los productos" })
    }
}

//OBTENER PRODUCTOS POR GRUPOS
const GetProductosXGrupos = async (req, res) => {
    const pagina = req.query.pag ? req.query.pag : 0
    let filtro = (req.query.sort && req.query.sort !== undefined) ? req.query.sort : 'recent'
    const cantidadReg = 30
    const skipReg = pagina * cantidadReg
    const { grupos } = req.body

    try {
        const data = await GetProductosXGrupos_Query(grupos, skipReg, cantidadReg, filtro)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.error(error)
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener los productos" })
    }

}

//OBTENER PRODUCTOS POR TIPO
const GetProductosXTipos = async (req, res) => {
    const pagina = req.query.pag ? req.query.pag : 0
    let filtro = (req.query.sort && req.query.sort !== undefined) ? req.query.sort : 'recent'
    const cantidadReg = 30
    const skipReg = pagina * cantidadReg
    const { tipos } = req.body

    try {
        const data = await GetProductosXTipos_Query(tipos, skipReg, cantidadReg, filtro)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener los productos" })
    }
}

//OBTENER UN PRODUCTO POR StrIdProducto
const GetProductoXid = async (req, res) => {
    const { id } = req.params

    try {
        let imagenes = await GetImagesXid_Query(id)
        const data = await GetProductoXid_Query(id)
        res.status(200).json({ success: true, data: data, images: imagenes })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener la informacion del producto" })
    }

}

//CONTAR LA CANTIDAD DE PRODUCTOS POR CLASE + CANTIDAD DE PAGINAS QUE DEBERIA TENER 
const ContarProductos = async (req, res) => {
    try {
        const data = await ContarProductos_Query()
        let cantidadPaginas = CalcularPaginas(data.totalColumna)
        res.status(200).json({ success: true, data: data.totalColumna, Paginas: cantidadPaginas })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: `Ha ocurrido un error al contar los productos de la clase` })
    }
}

//CONTAR LA CANTIDAD DE PRODUCTOS POR CLASE + CANTIDAD DE PAGINAS QUE DEBERIA TENER 
const ContarProductosXClase = async (req, res) => {
    const { clase } = req.params
    try {
        const data = await ContarProductosXClase_Query(clase)
        let cantidadPaginas = CalcularPaginas(data.totalColumna)
        res.status(200).json({ success: true, data: data.totalColumna, Paginas: cantidadPaginas })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: `Ha ocurrido un error al contar los productos de la clase ${clase}` })
    }
}

//CONTAR LA CANTIDAD DE PRODUCTOS POR LINEA + CANTIDAD DE PAGINAS QUE DEBERIA TENER 
const ContarProductosXLineas = async (req, res) => {
    const { lineas } = req.body;

    try {
        const data = await ContarProductosXLineas_Query(lineas)
        let cantidadPaginas = CalcularPaginas(data.total)
        const totalCount = data.total;
        res.status(200).json({ success: true, data: totalCount, Paginas: cantidadPaginas });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message, message: `Ha ocurrido un error al contar los productos de las lineas ${lineasString}` });
    }
};

//CONTAR LA CANTIDAD DE PRODUCTOS POR GRUPOS + CANTIDAD DE PAGUNAS QUE DEBERIA TENER
const ContarProductosXGrupos = async (req, res) => {
    const { grupos } = req.body;

    try {
        const data = await ContarProductosXGrupos_Query(grupos)
        let cantidadPaginas = CalcularPaginas(data.total)
        const totalCount = data.total;
        res.status(200).json({ success: true, data: totalCount, Paginas: cantidadPaginas });

    } catch (error) {
        console.error(error)
        res.status(400).json({ success: false, error: errror.message, message: `Ha ocurrido un error al contar los productos de los grupos  ${grusposString}` });
    }
}

const ContarProductosXTipos = async (req, res) => {
    const { tipos } = req.body;

    try {
        const data = await ContarProductosXTipos_Query(tipos)
        let cantidadPaginas = CalcularPaginas(data.total)
        const totalCount = data.total;
        res.status(200).json({ success: true, data: totalCount, Paginas: cantidadPaginas });

    } catch (error) {
        res.status(400).json({ success: false, error: err.message, message: `Ha ocurrido un error al contar los productos de los grupos  ${grusposString}` });
    }
}

const Buscar_Productos = async (req, res) => {
    const pagina = req.query.pag ? parseInt(req.query.pag) : 0
    let filtro = (req.query.sort && req.query.sort !== undefined) ? req.query.sort : 'recent'
    const texto = req.query.p
    const cantidadReg = 30
    const skipReg = pagina * cantidadReg

    try {
        const data = await Buscar_Productos_Query(texto, skipReg, cantidadReg, filtro)
        if (data.length > 0) {
            res.status(200).json({ success: true, data: data })
        } else {
            res.status(200).json({ success: false, data: 0 })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener los productos" })
    }
}

const BuscarProductosSimilares = async (req, res) => {
    const pagina = req.query.pag ? parseInt(req.query.pag) : 0
    const texto = req.query.p
    const cantidadReg = 30
    const skipReg = pagina * cantidadReg

    try {
        const data = await BuscarProductosSimilares_Query(texto, skipReg, cantidadReg)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al obtener los productos" })
    }
}

const Contar_Productos_Busqueda = async (req, res) => {
    const { q } = req.query
    try {
        const data = await Contar_Productos_Busqueda_Query(q)
        const cantidadPaginas = CalcularPaginas(data[0].totalColumna)
        res.status(200).json({ success: true, total: data[0].totalColumna, Paginas: cantidadPaginas });
    } catch (error) {
        console.error(error)
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al contar los productos" })
    }
}

// FUNCION PARA CALCULAR LA CANTIDAD DE PAGINAS
const CalcularPaginas = (cantidadProductos) => {
    return Math.ceil(parseInt(cantidadProductos) / 30)
}

// FUNCION PARA RECOMENDAR PRODUCTOS SIMILARES
const ProductosSimilares = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ObtenerRecomendaciones_Query(id)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error al contar los productos" })
    }
}

//FUNCION PARA OBTENER LOS 30 PRODUCTOS MAS VENDIDOS EN LOS ULTIMOS 30 DIAS
const ProductoMasVendidosUltimoMes = async (req, res) => {
    try {
        const productos = await ProductoMasVendidosUltimoMes_Query()
        res.status(200).json({ success: true, data: productos })
    } catch (error) {
        res.status(400).json({ success: false, error: error, message: "Ha ocurrido un error con los productos mas vendidos." })
    }
}

module.exports = {
    GetProductos,
    GetProductoXid,
    ContarProductosXClase,
    ContarProductosXLineas,
    GetProductosXlinea,
    GetProductosXGrupos,
    GetProductosXTipos,
    ContarProductosXGrupos,
    ContarProductos,
    ContarProductosXTipos,
    Buscar_Productos,
    Contar_Productos_Busqueda,
    BuscarProductosSimilares,
    ProductosSimilares,
    ProductoMasVendidosUltimoMes
}