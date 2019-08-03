const router = new (require('restify-router')).Router();
const version = 2.3;

router.get('/', function (req, res, next) {
	res.status(200);
	res.json({version: version})
});

module.exports = router;
