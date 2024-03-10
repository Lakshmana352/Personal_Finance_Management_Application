module.exports = (sequelize,DataTypes) => {
  const user = sequelize.define('user',{
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING
    },
    email:{
      type:DataTypes.STRING
    },
    password:{
      type: DataTypes.STRING
    }
  });
  return user;
}