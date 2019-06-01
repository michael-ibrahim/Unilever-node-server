const router = new (require('restify-router')).Router();
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Area = require('../models/Area')
const Factory = require('../models/Factory')
const Sparepart = require('../models/Sparepart')


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

router.post('/', function (req, res, next) {
	let line = req.body.line;
	Line.create({ name: line.name, area_id: line.area_id}).then(line => {
		res.json(line);
	})
});

module.exports = router;