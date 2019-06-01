const router = new (require('restify-router')).Router();
const Area = require('../models/Area')
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Factory = require('../models/Factory')

router.get('/', function (req, res, next) {

	//where
	let where_statement = {};
	if(req.query.id)
		where_statement.id = req.query.id;
	if(req.query.factoryId)
		where_statement.factoryId = req.query.factoryId;

	Area.findAll({
		where: where_statement,
		include: [
			{	model:Factory, attributes: ['id','name'] },
			{ model: Line, include:{
					model:Machine, attributes:['id','name']
				}
			}
		]
	}).then(areas => {
		res.json(areas);
	});
});

router.post('/', function (req, res, next) {
	let area = req.body.area;
	Area.create(area).then(area_ => {
		res.json(area_);
	})
});

router.put('/:id', function (req, res, next) {
	let area = req.body.area;
	Area.findByPk(req.params.id).then(area_ => {
		if(!area_){
			res.status(404);
			res.end();
			return;
		}
		area_.update(area).then( (area_) => {
			res.json(area_);
		})
	})
});

router.del('/:id', function (req, res, next) {
	Area.findByPk(req.params.id).then(area_ => {
		if(!area_){
			res.status(404);
			res.end();
			return;
		}
		area_.destroy().then( (area_) => {
			res.json(area_);
		})
	})
});

module.exports = router;
