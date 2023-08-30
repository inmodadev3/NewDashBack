const DASH = require('../../databases/DashConexion').dashConexion
const xlsx = require('xlsx')

const CargarDetallesContenedor = async(req, res) => {
    //excel, importacion, raggi
    const file = req.file
    const { importacion, raggi } = req.body
    const fecha = new Date()

    //Validar que halla llegado un archivo
    if (!file) {
        return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' })
    }

    //Convertir el archivo xlsx en un objeto Json 
    const workbook = xlsx.read(file.buffer, { type: 'buffer' }) //transoformar el buffer en un archivo xlsx
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; 
    const data = xlsx.utils.sheet_to_json(worksheet);

    //Validar que el documento tenga datos
    if(data.length === 0){
        return res.status(200).json({error:'El archivo no tiene datos.'})
    }

    //Calcular el total de la compra
    let total = 0 

    /* 
    item['Cantidad por paca']
    item.Cantidad
    item.Color
    item.CxU
    item.Descripcion
    item.Dimension
    item.Material
    item.Referencia
    item['Unidad de Medida']
    item.Valor
    */

    data.forEach((item)=>{
        let stringNumero = (item.Valor).replace(".","").replace(",",".") 
        let numero = parseFloat(stringNumero)
        total += numero * (item.Cantidad)
    })

    let sql = `INSERT INTO tbldocumentos (strRaggi,strImportacion,intTRM,intOTM,intOTMUSD,intOTMSUP,intArancel,intArancelUSD,intArancelSUP,intIVA,intIVAUSD,intIVASUP,intDescargues,intDescarguesUSD,intDescarguesSUP,intDepositoFranca
    ,intDepositoFrancaUSD,intDepositoFrancaSUP,intNaviera,intNavieraUSD,intNavieraSUP,intTIC,intTICUSD,intTICSUP,intOtrosUno,intOtrosUnoUSD,intOtrosUnoSUP,intOtrosDos,intOtrosDosUSD,intOtrosDosSUP,datFecha,intPorcentajeDescuento,idEstado,intValorTotalCompra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    let sqlDetalle = `CALL SP_AgregarDocumentoDetalleCompra(?,?,?,?,?,?,?,?,?,?,?,?,?)`
    
    DASH.query(sql,[raggi,importacion,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,fecha,100,5,total],(err,rows)=>{
        if(err)return res.status(404).json({data:err,message:"HA OCURRIDO UN ERROR GENERANDO EL DOCUMENTO"})
        data.forEach((item)=>{
            let stringNumero = (item.Valor).replace(".","").replace(",",".") 
            let valorParseado = parseFloat(stringNumero)
            DASH.query(sqlDetalle,["",item.Referencia,item.Cantidad,item['Unidad de Medida'],valorParseado,item.Descripcion,1,item.Color,item.CxU,item.Dimension,"",item['Cantidad por paca'],item.Material],(err,rows)=>{
                if(err)return res.json(404).json({data:err,message:"Ha OCURRIDO UN ERROR INGRESANDO LOS PRODUCTOS"})
                console.log("Creado con exito")
                console.log(rows)
            })
        })
        
    })
    

    console.log("Finalizado")
    
    res.json({ data:data,message:"Compra Cargada con exito" })
}


module.exports = {
    CargarDetallesContenedor
}