const Sequelize = require('sequelize');
const sequelize  = require('../sequelize');
const Image = require('../image');

const Factory = sequelize.define('factory', {
	name: {
    type: Sequelize.STRING,
    allowNull: false
  },
	image: {
		type: Sequelize.VIRTUAL,
		get(){
			return Image.image("factories",this.id);
		}
	},
	defaultImage:{
		type: Sequelize.VIRTUAL,
		get(){
			return Image.defaultImage("factories");
		}
	}
});


module.exports = Factory;
