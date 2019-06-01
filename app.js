const restify = require('restify');
const router = new (require('restify-router')).Router();
const sequelize  = require('./sequelize');
const corsMiddleware = require('restify-cors-middleware')
const config = require('./CONFIG');
require ('./models/relations');
const fs = require('fs')

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*']
})


const server = restify.createServer({
	name: 'unilever',
	version: '1.0.0',
});

server.pre(cors.preflight)
server.use(cors.actual)

const logger = require('./basic-logger');
const factory = require('./routes/factory');
const area = require('./routes/area');
const line = require('./routes/line');
const machine = require('./routes/machine');
const sparepart = require('./routes/sparepart');
const transaction = require('./routes/transaction');

server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 10,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());

router.add('/factory', factory);
router.add('/area', area);
router.add('/line', line);
router.add('/machine', machine);
router.add('/sparepart', sparepart);
router.add('/transaction', transaction);
router.applyRoutes(server);

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(config.port, function () {
	console.log('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});

server.get(/\/public\/?.*/, restify.plugins.serveStatic({
    directory: __dirname
}));
