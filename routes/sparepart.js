const router = new (require('restify-router')).Router();
const Factory = require('../models/Factory')
const Area = require('../models/Area')
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Sparepart = require('../models/Sparepart')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;


router.get('/', function (req, res, next) {

	//where
	let where_statement = {};
	if(req.query.id)
		where_statement.id = req.query.id;
	if(req.query.machineId)
		where_statement.machineId = req.query.machineId;
	if(req.query.search)
		where_statement.name = {[Op.or]: [
			Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('sparepart.name')), 'LIKE', '%' + req.query.search.toLowerCase() + '%'),
			Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('sparepart.code')), 'LIKE', '%' + req.query.search.toLowerCase() + '%')
		]}

	Sparepart.findAll({
		where: where_statement,
		limit: 250,			//limit So things dont get crazy
		include: [{
			model: Machine, attributes: ['id','name'], include: {
				model: Line, attributes: ['id','name'], include: {
					model: Area, attributes: ['id','name'], include: {
						model: Factory, attributes: ['id','name'],
					}
				}
			}
		}]
	}).then(spareparts => {

		res.json(spareparts);
	});
});

// router.post('/', function (req, res, next) {
// 	let sparepart = req.body.sparepart;
// 	Machine.findByPk(sparepart.machineId).then(machine => {
// 		Sparepart.create(sparepart).then(sparepart_ => {
// 			sparepart_.setMachines([machine]);
// 			res.json(sparepart_);
// 		})
// 	});
// });

module.exports = router;
