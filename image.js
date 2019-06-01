const fs = require("fs")
const config = require('./CONFIG');

function image(folder, id){
	let filepath;

	filepath = config.domain + ':'+ config.port + '/public/images/'+folder+'/'+id+'.jpg';
	return filepath
}

function defaultImage(folder){
	let filepath;

	filepath = config.domain + ':'+ config.port + '/public/images/'+folder+'/default.jpg';
	return filepath
}

function sparepartImage(folder,code){
	let filepath;

	filepath = config.domain + ':'+ config.port + '/public/images/'+folder+'/'+code+'.jpg';
	return filepath
}


module.exports = { image, defaultImage, sparepartImage};
