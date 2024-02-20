const HGI = require('../databases/HgiConexion').HgiConexion

const GetUbicaciones = (strIdProducto) =>{
    return new Promise((resolve,reject)=>{
        const query = `select StrParam2 from TblProductos where StrIdProducto = '${strIdProducto}'`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return
            }
            resolve(rows.recordset)
        })
    })
}

function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;

    const matrix = [];
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i-1][j] + 1,        
                matrix[i][j-1] + 1,    
                matrix[i-1][j-1] + cost
            );
        }
    }

    return matrix[len1][len2];
}


module.exports = {GetUbicaciones,levenshteinDistance}