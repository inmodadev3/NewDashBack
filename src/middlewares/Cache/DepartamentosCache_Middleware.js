const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 604800 });

const departamentosCacheMiddleware = (req, res, next) => {
    const key = 'departamentos';
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

module.exports = departamentosCacheMiddleware
