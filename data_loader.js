const sequelize  = require('./sequelize');
const { Parser } = require('json2csv');
const csvFilePath='filepath';
const csv=require('csvtojson');
const fs = require('fs');

function read_csv(){
  csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
    console.log(jsonObj);
    // add_machine(jsonObj, 0)
    // add_sparepart(jsonObj, 0);
    // add_sparepart_machine(jsonObj, 0);
  })
}

//export_database()
function export_database(){
  sequelize.query(`Select factory.name as factory,
    area.name as area,
    line.name as line,
    machine.name as machine,
    sparepart.name as sparepart,
    sparepart.code as code,
    sparepart.position as position
    from sparepart
    left join machinesparepart on sparepart.id = machinesparepart.sparepartId
    left join machine on machinesparepart.machineId = machine.id
    left join line on line.id = machine.lineId
    left join area on area.id = line.areaId
    left join factory on factory.id = area.factoryId
    order by factory.name, area.name, line.name, machine.name, sparepart.name
    `).then(([results, metadata]) => {
      const parser = new Parser({});
      const csv = parser.parse(results);
      fs.writeFile('all-spare-parts.csv', csv, function(err){
        if(err){
          console.log("Error writing File:",err);
        }
        else{
          console.log("File Written Successfully")
        }
      });
  })
}

function add_machine(array, index){
  let row = array[index];
  sequelize.query(`Select machine.id from machine left join line on machine.lineId = line.id where machine.name = '${row.Machine}' AND line.name= '${row.Line}'`).then(([results, metadata]) => {
    console.log(results.length)
    if(!results.length){
      sequelize.query(`insert into machine (name,lineId) values ('${row.Machine}', (select line.id from line left join area on area.id = line.areaId left join factory on factory.id = area.factoryId where line.name = '${row.Line}' AND area.name='${row.Area}' AND factory.name='${row.Factory}'))`).then(([results, metadata]) => {
        if(array[index+1]) add_machine(array, index+1);
      })
    }
    else{
      if(array[index+1]) add_machine(array, index+1);
    }
  })
}

function add_sparepart(array, index){
  let row = array[index];
  sequelize.query(`insert into sparepart (name,position,code) values ('${row.name}', '${row.position}', '${row.code}')`).then(([results, metadata]) => {
    console.log(results)
    if(array[index+1]) add_sparepart(array, index+1);
  })
}

function add_sparepart_machine(array, index){
  let row = array[index];
  sequelize.query(`select
    machine.id as machine
    from machine
    left join line on line.id = machine.lineId
    left join area on area.id = line.areaId
    left join factory on factory.id = area.factoryId
    where line.name = '${row.Line}'
    AND area.name='${row.Area}'
    AND factory.name='${row.Factory}'
    AND machine.name='${row.Machine}'
    `).then(([results, metadata]) => {
    let machine = results[0].machine;
    console.log("machine:",machine)
    sequelize.query(`Select sparepart.id as sparepart from sparepart where name = '${row.name}'`).then(([results, metadata]) => {
      console.log(results)
      let sparepart = results[0].sparepart;
      console.log("sparepart:",sparepart)
      sequelize.query(`insert into machinesparepart (machineId, sparepartId) values('${machine}','${sparepart}')`).then(([results, metadata]) => {
        if(array[index+1]) add_sparepart_machine(array, index+1);
      });
    })
  })
}
