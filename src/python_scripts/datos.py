import sys
import json
import os
from conexion import conectar
from createPDF import generar_catalogo

try:
    defaultPath = '/home/inmoda/ownCloud/fotos_nube/FOTOS  POR SECCION CON PRECIO/'
    rutasString =  sys.argv[1]
    precio_cat =  sys.argv[2]
    userId =  sys.argv[3]
    rutasArray = json.loads(rutasString)
    newPaths = []
    dataProductos = []


    for path in rutasArray:
        newPaths.append(defaultPath+path)

    query = f"SELECT strIdProducto,strDescripcion,intPrecio{precio_cat},StrUnidad,StrAuxiliar,strParam3 FROM tblProductos"

    #CONEXION A LA BASE DE DATOS
    connection = conectar()
    cursor = connection.cursor()
    ## REALIZAR LA CONSULTA DELA BASE DE DATOS
    cursor.execute(query)
    rows = cursor.fetchall()

    #print(rows)
    ### Crear un diccionario de precios a partir de los resultados de la base de datos
    desc_dict = {row[0]: str(row[1]) for row in rows}
    precios_dict = {row[0]: int(row[2]) for row in rows}
    unidad_dict = {row[0]: str(row[3]) for row in rows}
    cantU_dict = {row[0]: str(row[4]) for row in rows}
    dimension_dict = {row[0]: str(row[5]) for row in rows}

    #########################################

    def procesar_data(ruta_principal):
            dataProductos.clear()
            for root, dirs, files in os.walk(ruta_principal):
                for name in files: 
                    if name.endswith('$1.jpg'):
                        ref = name.split('$')
                        refe = ref[0]
                        precio = precios_dict.get(refe)
                        descrip = desc_dict.get(refe)
                        unidad = unidad_dict.get(refe)
                        cantUni = cantU_dict.get(refe) if cantU_dict.get(refe) is not None else ""
                        dimension = dimension_dict.get(refe) if dimension_dict.get(refe) is not None else "Sin dimension"
                        '''result_data = {
                            "refe":refe, 
                            "descripcion":descrip,
                            "precio":precio,
                            "unidad":unidad,
                            "cantUni":cantUni,
                            "dimension":dimension
                        }'''
                        #print(json.dumps(result_data))
                        rutaFoto = os.path.join(root,name).replace("\\","/")
                        dataProductos.append([refe, descrip, precio, rutaFoto,unidad,cantUni,dimension])
            nombre_clase=(ruta_principal[63: len(ruta_principal)]).replace("/","_")    # PARA CLASE NORMALES ESTA Y LINEA SIGUIENTE
            print(json.dumps(len(dataProductos)))
            generar_catalogo(f"{nombre_clase}", dataProductos,precio_cat,userId)
            

    for pathsPdf in newPaths:
        procesar_data(pathsPdf)

    #sys.stdout.flush()
    result_data = {
         "message":"procesamiento exitoso",
         "rutas": pathsPdf
    }
    print(json.dumps(result_data))
except Exception as e:
    error_message = str(e)
    error_data = {
        "error":error_message
    }
    print(json.dumps(error_data))
