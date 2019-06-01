const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');


const User = sequelize.define('user', {
	uid: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		allowNull: true
	}
});

module.exports = User;
