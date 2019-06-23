var jwt = require('jsonwebtoken');
const secret = "Unilever#123456789#";

function validateAdmin(req,res,next){
	let jwt_ = req.headers.jwt;
	if(!jwt_){
		res.status(401);
		res.end();
	}
	else {
		jwt.verify(jwt_, secret, (err, payload)=> {
			if(err){
				res.status(401);
				res.end();
			}
			else{
				req.headers.admin = payload;
				next();
			}
		});
	}
}

function getJWT(email){
	let token = jwt.sign({ email: email }, secret);
	return token;
}


module.exports = { auth, validateAdmin, getJWT};
