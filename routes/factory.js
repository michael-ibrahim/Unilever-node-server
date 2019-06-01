const router = new (require('restify-router')).Router();
const Factory = require('../models/Factory')
const Area = require('../models/Area')
const Line = require('../models/Line')

router.get('/', function (req, res, next) {

	//where
	let where_statement = {};
	if(req.query.id)
			where_statement.id = req.query.id;

	Factory.findAll({
		where: where_statement,
		include: {
			model: Area,
			include: {
				model:Line, attributes:['id','name']
			},
		}
	}).then(factories => {
		res.json(factories);
	});
});

router.post('/', function (req, res, next) {
	let factory = req.body.factory;
	Factory.create({ name: factory.name}).then(factory => {
		res.json(factory);
	})
});


module.exports = router;
