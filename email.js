const nodemailer = require("nodemailer");
const config = require('./CONFIG');
const Transaction = require('./models/Transaction');
const TransactionItem = require('./models/TransactionItem');
const Sparepart = require('./models/Sparepart');
const User = require('./models/User');
const Machine = require('./models/Machine')
const Line = require('./models/Line')
const Area = require('./models/Area')
const Factory = require('./models/Factory')
const Moment = require('moment');

function main(id){
	prepare_email(id);
}

function send_email(subject, html){
	// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	let transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
		service: 'yahoo',
    port: 465,
    secure: false,
    // requireTLS: true,
    auth: {
			user: config.email,
      pass: config.password
    },
		tls: { rejectUnauthorized: false },
		// logger: true
	});

	let mailOptions = {
		from: config.email,
		to: config.target_email,
		subject: subject,
		html: html
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		else{
			console.log('Email Sent Successfully');
		}
	});
}

function prepare_email(id){
	Transaction.findOne({
		where: {id:id},
		include: [{
			model: TransactionItem, include: {
				model: Sparepart, include:{
					model: Machine, include:{
						model: Line, include:{
							model: Area, include:
								Factory
						}
					}
				}
			}
		}, User]
	}).then(transaction => {
		let body = "";
		body+= `
			<table border="1" style="text-align:center; border-collapse:collapse; width:100%;">
				<tr>
		      <th colspan="8">
		        SPARES ISSUE REQUEST
		      </th>
		    </tr>
		    <tr>
		      <th colspan="4">Transaction Id:</th>
		      <td colspan="4">${transaction.id}</td>
		    </tr>
		    <tr style="border-top: 3px solid black;">
		      <th colspan="4">Date</th>
		      <th colspan="4">Time</th>
		    </tr>
		    <tr>
		      <td colspan="4">${Moment(transaction.createdAt).format('D/M/YYYY')}</td>
		      <td colspan="4">${Moment(transaction.createdAt).format('LT')}</td> <!-- Cairo Time Zone -->
		    </tr>
		    <tr style="border-top: 3px solid black;">
		      <th>NO</th>
		      <th>Area</th>
		      <th>Line</th>
		      <th>Machine</th>
		      <th>Material Sap</th>
		      <th>Part Description</th>
		      <th>Part Location</th>
		      <th>Quantity</th>
		    </tr>
				`
				for(let i =0; i < transaction.transactionItems.length; i++){
					body += `
						<tr>
							<td>${i+1}</td>
							<td>${transaction.transactionItems[i].sparepart.machines[0].line.area.name}</td>
							<td>${transaction.transactionItems[i].sparepart.machines[0].line.name}</td>
							<td>${transaction.transactionItems[i].sparepart.machines[0].name}</td>
							<td>${transaction.transactionItems[i].sparepart.code}</td>
							<td>${transaction.transactionItems[i].sparepart.name}</td>
							<td>${transaction.transactionItems[i].sparepart.position}</td>
							<td>${transaction.transactionItems[i].count}</td>
						</tr>
					`
				}
				body +=`
		    <tr style="border-top: 3px solid black;">
		      <th>Technician</th>
		      <td>${transaction.user.name}</td>
		      <td colspan="2"></td>
		      <td colspan="2">Maintenance MGR</td>
		      <td colspan="2"></td>
		    </tr>
		  </table>
		`
		send_email("Unilever Warehousing Transaction", body);
	});
}

module.exports = main;
