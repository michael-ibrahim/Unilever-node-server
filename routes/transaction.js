const router = new (require('restify-router')).Router();
const Sparepart = require('../models/Sparepart')
const Machine = require('../models/Machine')
const Line = require('../models/Line')
const Area = require('../models/Area')
const Factory = require('../models/Factory')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const TransactionItem = require('../models/TransactionItem')
const email = require('../email')

router.get('/', function (req, res, next) {

	//where
	let where_statement = {};
	if(req.query.id)
		where_statement.id = req.query.id;

	Transaction.findAll({
		where: where_statement,
		include: [{
			model: TransactionItem, include: {
				model: Sparepart, include: {
					model: Machine, include:{
						model: Line, include:{
							model: Area, include: Factory
						}
					}
				}
			}
		}, User]
	}).then(transactions => {
		res.json(transactions);
	});
});

router.post('/', function (req, res, next) {
	// console.log(req.body);
	if( !(req.body.cart && req.body.cart.length
				&& req.body.user && req.body.user.uid && req.body.user.user_id) ){
		res.status(400);
		res.end();
	}
	else{
		User.findOrCreate({where:
			{uid: req.body.user.uid, name: req.body.user.user_id}
		}).then(([user, created]) => {

			let transactionsItems = [];
			Transaction.create({
				userId: user.id
			}).then(transaction => {
				for(let item of req.body.cart){
					transactionsItems.push({ count: item.count, sparepartId: item.id, transactionId: transaction.id});
				}
				TransactionItem.bulkCreate(transactionsItems).then(results=> {
					email(transaction.id)
					res.status(200);
					res.json({id:transaction.id});
				}).catch(err => {
					console.log(err);
					transaction.destroy();
					res.status(400);
					res.end();
				});
			})
		})
	}
});



module.exports = router;
