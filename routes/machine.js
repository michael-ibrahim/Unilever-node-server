const router = new (require('restify-router')).Router();
const Factory = require('../models/Factory')
const Area = require('../models/Area')
const Line = require('../models/Line')
const Machine = require('../models/Machine')
const Sparepart = require('../models/Sparepart')
const Auth = require('../authentication');

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

router.post('/', Auth.validateAdmin, function (req, res, next) {
	let machine = req.body.machine;
	Machine.create(machine).then(machine_ => {
		res.json(machine_);
	})
});

router.put('/:id', Auth.validateAdmin, function (req, res, next) {
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

router.del('/:id', Auth.validateAdmin, function (req, res, next) {
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

// Machine.findByPk(req.params.id).then(machine_ => {
// 	if(!machine_){
// 		res.status(404);
// 		res.end();
// 		return;
// 	}
// 	else{
//
// 	}
// })

function ParseCSVFromBase64(base64,cb){
	let str= Buffer.from(base64, 'base64').toString();
	const csv=require('csvtojson')
	csv()
	.fromString(str)
	.then((json)=>{
		return cb(json);
	})
}

router.post('/bulk-add/', Auth.validateAdmin, function(req,res,next){


	Machine.findAll({ where: { id: req.body.machines } }).then(machines_ => {
		if(!machines_){
			res.status(404);
			res.end();
			return;
		}

		else{

			let fileBase64 = req.body.file.split(',').pop();
			ParseCSVFromBase64(fileBase64,(spareparts)=>{

				//Saving codes for inside bulk create.. As Bulk Create does not return results. So you have to manually query again
				let codes =[];
				for(let s of spareparts){
					codes.push(s.code);
				}

				// Adding Spareparts to the database
				Sparepart.bulkCreate(spareparts, {
					updateOnDuplicate: ["code","name","position"]
				}).then( ()=> {

					//Bulk Create does not return results. So you have to manually query again, using the codes array.
					Sparepart.findAll({ where: { code:codes } }).then(spareparts_ => {

						// Associating the Spareparts with the provided machine
						for(let sparepart_ of spareparts_){
							sparepart_.addMachines(machines_);
						}

						res.status(200);
						res.end();
					})
				}, err=> {

					console.log(err);
					//Handling Different Errors
					let errorMsg;
					switch(err.errors[0].type){
						case "unique violation":
							errorMsg = `${err.errors[0].path} '${err.errors[0].value}' already exists in the database.`;
							res.status(409);
							res.end(errorMsg);
							return;
						default:
							errorMsg = "Could not process the provided data. Please, make sure it is valid.";
							res.status(500);
							res.end(errorMsg);
							return;
					}
				});
			});
		}
	});
});

module.exports = router;
