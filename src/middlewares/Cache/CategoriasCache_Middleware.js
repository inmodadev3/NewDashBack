const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 3600 });

const categoriasCacheMiddleware = (req, res, next) => {
    const key = 'categorias';
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
};


module.exports = categoriasCacheMiddleware