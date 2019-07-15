const router = new (require('restify-router')).Router();
const Admin = require('../models/Admin');

router.get('/', function (req, res, next) {
	//where
	let where_statement = {};
	if(req.query.id)
		where_statement.id = req.query.id;

	Admin.findAll({
		where: where_statement
	}).then(admins => {
		res.json(admins);
	});
});

router.post('/', function (req, res, next) {
	let admin = req.body.admin;
	Admin.create(admin).then(admin => {
		res.status(201);
		res.json(admin);
	})
});

router.del('/:id', function (req, res, next) {
	Admin.findByPk(req.params.id).then(admin => {
		if(!admin){
			res.status(404);
			res.end();
			return;
		}
		admin.destroy().then( (admin) => {
			res.json(admin);
		})
	})
});

module.exports = router;
