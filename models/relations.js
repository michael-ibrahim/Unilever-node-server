const Factory = require('./Factory')
const Area = require('./Area');
const Line = require('./Line');
const Machine = require('./Machine');
const Sparepart = require('./Sparepart');
const Transaction = require('./Transaction');
const TransactionItem = require('./TransactionItem');
const User = require('./User');


Area.belongsTo(Factory)
Factory.hasMany(Area)

Line.belongsTo(Area)
Area.hasMany(Line)

Machine.belongsTo(Line)
Line.hasMany(Machine)

Sparepart.belongsToMany(Machine, {through: 'MachineSparepart'});
Machine.belongsToMany(Sparepart, {through: 'MachineSparepart'});

TransactionItem.belongsTo(Sparepart)

TransactionItem.belongsTo(Transaction)
Transaction.hasMany(TransactionItem)

Transaction.belongsTo(User)
User.hasMany(Transaction)
