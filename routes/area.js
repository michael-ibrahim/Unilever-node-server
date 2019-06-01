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
	Area.create({ name: area.name, factory_id: area.factory_id}).then(area => {
		res.json(area);
	})
});

module.exports = router;