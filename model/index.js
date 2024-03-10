const {Sequelize, DataTypes} = require("sequelize");

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_host = process.env.DB_HOST;
const db_pw = process.env.DB_PW;

const sequelize = new Sequelize(db_name,db_user,db_pw,{
  host: db_host,
  dialect: "mysql"
});

sequelize.authenticate()
  .then(()=>{
    console.log(`DataBase connection successful.`);
  })
  .catch((err)=>{
    console.log(err);
  });

const db = {};
db.sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./users')(sequelize,DataTypes);
db.transactions = require('./transactions')(sequelize,DataTypes);
db.type = require('./type')(sequelize,DataTypes);

db.sequelize.options.logging = false;

db.sequelize.sync({force:false})
  .then(()=>{
    console.log(`Sync with DB is successfull.`);
  })
  .catch((err)=>{
    console.log(err);
  })

module.exports = db;