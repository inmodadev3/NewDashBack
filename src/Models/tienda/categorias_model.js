const Categorias = {}

Categorias.Clases = () => {
    return `SELECT 
        C.StrIdClase,
        C.StrDescripcion AS ClaseDescripcion,
        L.StrIdLinea,
        L.StrDescripcion AS LineaDescripcion,
        G.strIdGrupo,
        G.StrDescripcion AS GrupoDescripcion,
        T.strIdTipo,
        T.strDescripcion AS TipoDescripcion
    FROM TblClases C
    LEFT JOIN TblProductos P ON C.StrIdClase = P.StrClase
    LEFT JOIN TblLineas L ON P.StrLinea = L.StrIdLinea
    LEFT JOIN TblGrupos G ON P.strGrupo = G.strIdGrupo
    LEFT JOIN TblTipos T ON P.strTipo = T.strIdTipo
    WHERE C.StrIdClase IN ('1001', '101', '1011', '1021', '1031', '971', '741', '991', '731')
    AND P.IntHabilitarProd = 1
    ORDER BY C.StrDescripcion, L.StrDescripcion, G.StrDescripcion, T.strDescripcion`
}

//, '101', '1011', '1021', '1031', '971', '741', '991', '731'

module.exports = Categorias