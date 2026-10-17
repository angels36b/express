export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
    const app = express();

    // ============================================================
    // Middleware global: headers CORS y política de Trailing Slashes
    // ============================================================
    app.use((req, res, next) => {
    // 1. Cabeceras CORS requeridas por el ejercicio
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    
    // 2. Cabeceras extra necesarias para que los verificadores no fallen
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // 3. Manejo de la petición preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); 
    }

    // 4. Tu lógica de Trailing Slashes (Redirección)
    const queryIndex = req.originalUrl.indexOf('?');
    const path = queryIndex === -1
        ? req.originalUrl
        : req.originalUrl.slice(0, queryIndex);
    const query = queryIndex === -1
        ? ''
        : req.originalUrl.slice(queryIndex);

    if (path !== '/' && !path.endsWith('/')) {
        return res.redirect(308, path + '/' + query);
    }

    next();
});

    // ============================================================
    // Body parsers
    // ============================================================
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // ============================================================
    // RUTA: /login/
    // ============================================================
    app.get('/login/', (req, res) => {
        res.send('angel36b');
    });

    // ============================================================
    // RUTA: /code/
    // ============================================================
    app.get('/code/', (req, res) => {
        res.type('text/plain');
        createReadStream(import.meta.url.substring(7)).pipe(res);
    });

    // ============================================================
    // RUTA: /sha1/:input/
    // ============================================================
    app.get('/sha1/:input/', (req, res) => {
        const hash = crypto
            .createHash('sha1')
            .update(req.params.input)
            .digest('hex');
        res.send(hash);
    });

    // ============================================================
    // RUTA: /req/ (GET y POST)
    // ============================================================
    app.all('/req/', (req, res) => {
        const addr = req.query.addr || req.body.addr;

        if (!addr) {
            return res.status(400).send('Falta addr');
        }

        http.get(addr, (response) => {
            response.setEncoding('utf8');

            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                res.type('text/plain').send(data);
            });
        }).on('error', (err) => {
            res.status(500).send('Error: ' + err.message);
        });
    });

    // ============================================================
    // RUTA CATCH-ALL
    // ============================================================
    app.all('/{*splat}', (req, res) => {
        res.send('angel36b');
    });

    return app;
}