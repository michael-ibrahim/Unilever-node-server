const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');
const Image = require('../image');

const Line = sequelize.define('line', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	image: {
		type: Sequelize.VIRTUAL,
		get(){
			return Image.image("lines",this.id);
		}
	},
	defaultImage:{
		type: Sequelize.VIRTUAL,
		get(){
			return Image.defaultImage("lines");
		}
	}
});

module.exports = Line;
