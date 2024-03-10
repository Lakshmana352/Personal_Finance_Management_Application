module.exports = (sequelize,DataTypes) => {
  const transactions = sequelize.define('transaction',{
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user:{
      type: DataTypes.STRING
    },
    type:{
      type:DataTypes.STRING
    },
    amount:{
      type: DataTypes.INTEGER
    }
  },{updatedAt:false});
  return transactions;
}