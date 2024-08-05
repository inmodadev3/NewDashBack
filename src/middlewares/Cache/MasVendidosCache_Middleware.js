const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 3600 });

const masVendidosCacheMiddleware = (req, res, next) => {
    const key = 'mas-vendidos';
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


module.exports = masVendidosCacheMiddleware