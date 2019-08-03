const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');
const Image = require('../image');


const Sparepart = sequelize.define('sparepart', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	image: {
		type: Sequelize.VIRTUAL,
		get(){
			return Image.sparepartImage("spareparts",this.code);
		}
	},
	defaultImage:{
		type: Sequelize.VIRTUAL,
		get(){
			return Image.defaultImage("spareparts");
		}
	},
	position: {
		type: Sequelize.STRING,
		allowNull: true
	},
	code:{
		type: Sequelize.STRING,
		allowNull: true,
		unique: true
	}
});

module.exports = Sparepart;
