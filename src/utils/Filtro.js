const Filtro = (filtro = 'recent') => {
    let order = ""

    switch (filtro) {
        case 'recent':
            order = `CASE WHEN DatFechaFProdHab >= DATEADD(DAY, -15, GETDATE()) THEN 0 ELSE 1 END, 
            CASE WHEN DatFechaFProdNuevo >= DATEADD(DAY, -15, GETDATE()) THEN 0 ELSE 1 END,
            DatFechaFProdHab DESC,
            DatFechaFProdNuevo DESC,
            P.StrIdProducto`
            break;

        case 'price_asc':
            order = 'P.IntPrecio1 asc'
            break;

        case 'price_desc':
            order = 'P.IntPrecio1 desc'
            break;

        default:
            order = `CASE WHEN DatFechaFProdHab >= DATEADD(DAY, -15, GETDATE()) THEN 0 ELSE 1 END,
            CASE WHEN DatFechaFProdNuevo >= DATEADD(DAY, -15, GETDATE()) THEN 0 ELSE 1 END,
            DatFechaFProdHab DESC,
            DatFechaFProdNuevo DESC,
            P.StrIdProducto`
            break;
    }

    return order
}


module.exports = Filtro