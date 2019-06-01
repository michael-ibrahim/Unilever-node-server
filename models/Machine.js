const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');
const Image = require('../image');


const Machine = sequelize.define('machine', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	image: {
		type: Sequelize.VIRTUAL,
		get(){
			return Image.image("machines",this.id);
		}
	},
	defaultImage:{
		type: Sequelize.VIRTUAL,
		get(){
			return Image.defaultImage("machines");
		}
	}
});

module.exports = Machine;
