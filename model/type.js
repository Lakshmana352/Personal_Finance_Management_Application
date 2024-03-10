module.exports = (sequelize,DataTypes) => {
  const type = sequelize.define('type',{
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING
    }
  });
  return type;
}