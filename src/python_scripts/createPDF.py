from reportlab.lib.pagesizes import letter,A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
import os

def dividir_cadena(cadena, longitud_maxima=35):
    palabras = cadena.split()
    lineas = []
    linea_actual = ""

    for palabra in palabras:
        if len(linea_actual) + len(palabra) <= longitud_maxima:
            linea_actual += palabra + " "
        else:
            lineas.append(linea_actual)
            linea_actual = palabra + " "

    lineas.append(linea_actual)
    nueva_cadena = "\n".join(lineas)
    return nueva_cadena



def generar_catalogo(NomPdf ,productos,precio,userId):
    catalogo_folder = f"/var/www/html/NewDashBack/public/pdfs/{userId}/"

    # Verificar si la carpeta "catalogo" existe
    if not os.path.exists(catalogo_folder):
        os.makedirs(catalogo_folder)  # Cre

    doc = SimpleDocTemplate(f"{catalogo_folder}{NomPdf}_{precio}.pdf", pagesize=A4)
    path_image = "/var/www/html/NewDashBack/assets/img/INMODA.png"
    elements = []
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        name = "titulo",
        parent= styles["Title"],
        fontSize = 28,
        textColor = "black",
        spaceAfter = 50
    )


    
    elements.append(Paragraph(f"CATÁLOGO", title))  
    elements.append(Paragraph(f"{NomPdf.replace('_',' ')}", title)) 
    elements.append(Paragraph("\n", styles["Normal"]))
    elements.append(Image(path_image, width=120* mm, height=70*mm, ))

    #data = [["Imagen","Referencia", "Nombre","Precio"]]

    data = []

    for producto in productos:
        imagen = Image(f"{producto[3]}", width=95* mm, height=95*mm)
        #data.append([imagen, producto[0], producto[1], producto[2]])
        descripcion_porlineas = dividir_cadena(producto[1])if producto[1] else producto[1]
        combinar_data = [imagen,
                         f"\n\nReferencia: {producto[0]}\n{descripcion_porlineas}\nPrecio: {producto[2]}\nUnidad: {producto[4]}\nCant x unidad: {producto[5]}\nDimension: {producto[6]}"]
        data.append(combinar_data)


    table = Table(data, colWidths=[100 * mm, 50 * mm])
    #ancho_columna = 100 * mm
    # table = Table(data, colWidths= [ancho_columna] * len(data))
    # Definir estilo personalizado para las celdas
   
    
    table.setStyle(TableStyle([
        # Estilos de formato para la tabla
        #("ALIGN", (0, 0), (-1, -1), "CENTER"),
        #('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('LEFTPADDING', (0, 0), (-1, -1),3),    # Agregar relleno izquierdo
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),   # Agregar relleno derecho
        ('TOPPADDING', (0, 0), (-1, -1), 10),     # Agregar relleno superior
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),  # Agregar relleno inferior
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
    ]))
    print("Creando PDF")
    elements.append(table)
    doc.build(elements)
