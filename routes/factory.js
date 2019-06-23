const router = new (require('restify-router')).Router();
const Factory = require('../models/Factory')
const Area = require('../models/Area')
const Line = require('../models/Line')
const Auth = require('../authentication');

router.get('/',function (req, res, next) {

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
	Factory.create(factory).then(factory_ => {
		res.status(201);
		res.json(factory_);
	})
});

router.put('/:id', function (req, res, next) {
	let factory = req.body.factory;
	Factory.findByPk(req.params.id).then(factory_ => {
		if(!factory_){
			res.status(404);
			res.end();
			return;
		}
		factory_.update(factory).then( (factory_) => {
			res.json(factory_);
		})
	})
});

router.del('/:id', function (req, res, next) {
	Factory.findByPk(req.params.id).then(factory_ => {
		if(!factory_){
			res.status(404);
			res.end();
			return;
		}
		factory_.destroy().then( (factory_) => {
			res.json(factory_);
		})
	})
});


module.exports = router;
