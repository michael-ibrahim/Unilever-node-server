const router = new (require('restify-router')).Router();

router.get('/', function (req, res, next) {
	res.end("v2.1")
});

module.exports = router;
