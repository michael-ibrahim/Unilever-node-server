const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');
const Image = require('../image');

const Area = sequelize.define('area', {
	name: {
    type: Sequelize.STRING,
    allowNull: false
  },
	image: {
		type: Sequelize.VIRTUAL,
		get(){
			return Image.image("areas",this.id);
		}
	},
	defaultImage:{
		type: Sequelize.VIRTUAL,
		get(){
			return Image.defaultImage("areas");
		}
	}
});

module.exports = Area;
