const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');


const TransactionItem = sequelize.define('transactionItem', {
	count: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

module.exports = TransactionItem;
