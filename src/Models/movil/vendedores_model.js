const Vendedores = {}

Vendedores.Login = () =>{
    return `select stridVendedor, strNombreEmpleado, strUsuario, strClave from tbllogin
    where strUsuario = ? and strClave= ?`
}


module.exports = Vendedores