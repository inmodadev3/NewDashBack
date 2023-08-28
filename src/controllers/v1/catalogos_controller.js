const HGI = require('../../databases/HgiConexion').HgiConexion
const path = require('path')
const {spawn} = require('child_process')
const axios = require('axios')
const cheerio = require('cheerio');

const getFolders = async (req, res) => {
    const { ruta } = req.body
    const ruta_alterna = "http://10.10.10.128/ownCloud/fotos_nube/FOTOS%20%20POR%20SECCION%20CON%20PRECIO/"
    
    try {
        const response = await axios.get(ruta ? ruta : ruta_alterna);
        const html = response.data; // Esto dependerá del formato de respuesta del servidor
        const $ = cheerio.load(html); //Poder manipular y acceder a los datos del html
        const folderPaths = [];
        const imageFileNames = [];

        $('a[href$="/"]').each((index, element) => {
            const href = $(element).attr('href');
            if (!href.startsWith('./') && !href.startsWith('../')) {
                folderPaths.push(href);
            }
        });

        $('a[href$=".jpg"]').each((index, element) => {
            const href = $(element).attr('href');
            imageFileNames.push(href);
        });

        if (folderPaths.length > 0) {
            folderPaths.shift();
        }

        res.json({folderPaths,imageFileNames});
    } catch (error) {
        console.error('Error fetching folder paths:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

const createPDF = async(req,res) =>{

    const { data,precio,userId } = req.body
    const pythonScriptPath = 'C:/Users/venim/OneDrive/Escritorio/proyect/NewDash/DashBack/src/python_scripts/datos.py';

    const pythonProcess = spawn('python',[pythonScriptPath,JSON.stringify(data),precio,userId])

    let pythonResponse = "";

    pythonProcess.stdout.on('data', (data) => {
        pythonResponse = data.toString();
    });

    pythonProcess.stdout.on("end", () => {
        res.json({ data: {data,precio},finish:"Correct" });
    });
    
}

module.exports = {
    getFolders,
    createPDF
}