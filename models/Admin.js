const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');


const Admin = sequelize.define('admin', {
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: true
	}
});

module.exports = Admin;
