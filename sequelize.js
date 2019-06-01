const Sequelize = require('sequelize');
const CONFIG = require('./CONFIG')
const sequelize = new Sequelize('unilever', CONFIG.db_username, CONFIG.db_password, {
  host: 'localhost',
  dialect: 'mysql',
	logging: false,
	define:{
		freezeTableName: true
	},
  timezone: '+02:00'    //Cairo Time Zone
});

sequelize.authenticate().then(() => {
	console.log('MySQL Connection has been established successfully.');
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
