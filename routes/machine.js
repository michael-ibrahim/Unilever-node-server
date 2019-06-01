const router = new (require('restify-router')).Router();
const Factory = require('../models/Factory')
const Area = require('../models/Area')
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Sparepart = require('../models/Sparepart')


router.get('/', function (req, res, next) {

	//where
	let where_statement = {};
	if(req.query.id)
		where_statement.id = req.query.id;
	if(req.query.lineId)
		where_statement.lineId = req.query.lineId;

	Machine.findAll({
		where: where_statement,
		include: [{
			model: Line, attributes: ['id','name'], include: {
				model: Area, attributes: ['id','name'], include: {
					model: Factory, attributes: ['id','name'],
				}
			}
		},
		Sparepart
		]
	}).then(machines => {

		res.json(machines);
	});
});

router.post('/', function (req, res, next) {
	let machine = req.body.machine;
	Machine.create(machine).then(machine_ => {
		res.json(machine_);
	})
});

router.put('/:id', function (req, res, next) {
	let machine = req.body.machine;
	Machine.findByPk(req.params.id).then(machine_ => {
		if(!machine_){
			res.status(404);
			res.end();
			return;
		}
		machine_.update(machine).then( (machine_) => {
			res.json(machine_);
		})
	})
});

router.del('/:id', function (req, res, next) {
	Machine.findByPk(req.params.id).then(machine_ => {
		if(!machine_){
			res.status(404);
			res.end();
			return;
		}
		machine_.destroy().then( (machine_) => {
			res.json(machine_);
		})
	})
});

module.exports = router;
