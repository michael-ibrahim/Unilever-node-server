const router = new (require('restify-router')).Router();
const Admin = require('../models/Admin');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const Auth = require("../authentication");

router.post('/login', function (req, res, next) {
	let email = req.body.email;
	let password = req.body.password;

	if( !(email && password) ){
		res.status(400);
		res.end();
	}
	else{
		Admin.findOne({ where:
			{[Op.and]: [
				Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', email.toLowerCase()),
				Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('password')), 'LIKE', password.toLowerCase())
			]}
		}).then( (admin) => {
			if(admin){
				let JWT = Auth.getJWT(email);
				res.status(200);
				res.json({token: JWT});
			}
			else{
				res.status(401);
				res.end();
			}
		});
	}
});

module.exports = router;
