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
		<div style="background-color: #007dbb; color:white; padding: 20px;">
			<h2><strong>Transaction id</strong>: ${transaction.id}</h2>
			<h3><strong>User</strong>: ${transaction.user.name}</h3>
			<p>Time: ${Date(transaction.createdAt).toString()} </p>
		</div>
		<div style="background-color: #EEE; padding: 20px;">
			<h4>Items:</h4>
			<table style=" border-collapse: collapse; width: 100%;">
			<tr style="border: 1px solid #CCC; text-align: left;">
				<th>Amount</th>
				<th>Spare Part</th>
				<th>Machine</th>
				<th>Line</th>
				<th>Area</th>
				<th>Factory</th>
			</tr>`;

				for(let item of transaction.transactionItems){
					body+= `<tr style="border: 1px solid #CCC;">
					<td >${item.count}</td>
					<td>${item.sparepart.name}</td>
					<td>${item.sparepart.machines[0].name}</td>
					<td>${item.sparepart.machines[0].line.name}</td>
					<td>${item.sparepart.machines[0].line.area.name}</td>
					<td>${item.sparepart.machines[0].line.area.factory.name}</td>
					</tr>`;
				}
		body+=`</table>
		</div>`
		send_email("Unilever Warehousing Transaction", body);
	});
}

module.exports = main;
