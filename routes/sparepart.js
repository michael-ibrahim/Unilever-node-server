const router = new (require('restify-router')).Router();
const Factory = require('../models/Factory')
const Area = require('../models/Area')
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Sparepart = require('../models/Sparepart')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const Auth = require('../authentication')

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
		limit: 100,			//limit So things dont get crazy
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

router.post('/', Auth.validateAdmin, function (req, res, next) {
	let sparepart = req.body.sparepart;
	//Machine.findByPk(sparepart.machineId).then(machine => {
		Sparepart.create(sparepart).then(sparepart_ => {
			if(sparepart.machineIds) sparepart_.setMachines(sparepart.machineIds);
			res.json(sparepart_);
		})
//	});
});

router.put('/:id', Auth.validateAdmin, function (req, res, next) {
	let sparepart = req.body.sparepart;
	Sparepart.findByPk(req.params.id).then(sparepart_ => {
		if(!sparepart_){
			res.status(404);
			res.end();
			return;
		}
		sparepart_.update(sparepart).then( (sparepart_) => {
			if(sparepart.machineIds) sparepart_.setMachines(sparepart.machineIds);
			res.json(sparepart_);
		})
	})
});

router.del('/:id', Auth.validateAdmin, function (req, res, next) {
	Sparepart.findByPk(req.params.id).then(sparepart_ => {
		if(!sparepart_){
			res.status(404);
			res.end();
			return;
		}
		sparepart_.destroy().then( (sparepart_) => {
			res.json(sparepart_);
		})
	})
});

module.exports = router;
