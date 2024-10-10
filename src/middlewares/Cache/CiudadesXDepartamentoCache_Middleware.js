const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 604800 });

const ciudadesXDepartamentoCacheMiddleware = (req, res, next) => {
    const { departamento } = req.params
    const key = `ciudades:${departamento}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
    } else {
        res.sendResponse = res.json;
        res.json = (body) => {
            cache.set(key, JSON.stringify(body));
            res.sendResponse(body);
        };
        next();
    }

}

module.exports = ciudadesXDepartamentoCacheMiddleware
