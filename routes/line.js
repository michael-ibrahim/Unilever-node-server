const router = new (require('restify-router')).Router();
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Area = require('../models/Area')
const Factory = require('../models/Factory')
const Sparepart = require('../models/Sparepart')
const Auth = require('../authentication');

router.get('/', function (req, res, next) {

	//where
	let where_statement = {};
	if(req.query.id)
		where_statement.id = req.query.id;
	if(req.query.areaId)
		where_statement.areaId = req.query.areaId;

	Line.findAll({
		where: where_statement,
		include: [{
			model: Area, attributes: ['name','id'], include: {
				model: Factory, attributes: ['name','id']
			}
		},
		{
			model: Machine,
			include: { model: Sparepart, attributes: ['name','id']}
		}
		]
	}).then(lines => {

		res.json(lines);
	});
});

router.post('/', Auth.validateAdmin, function (req, res, next) {
	let line = req.body.line;
	Line.create(line).then(line_ => {
		res.json(line_);
	})
});

router.put('/:id', Auth.validateAdmin, function (req, res, next) {
	let line = req.body.line;
	Line.findByPk(req.params.id).then(line_ => {
		if(!line_){
			res.status(404);
			res.end();
			return;
		}
		line_.update(line).then( (line_) => {
			res.json(line_);
		})
	})
});

router.del('/:id', Auth.validateAdmin, function (req, res, next) {
	Line.findByPk(req.params.id).then(line_ => {
		if(!line_){
			res.status(404);
			res.end();
			return;
		}
		line_.destroy().then( (line_) => {
			res.json(line_);
		})
	})
});

module.exports = router;
