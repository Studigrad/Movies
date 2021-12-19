const sqlite3 = require('sqlite3').verbose();
const { Sequelize,DataTypes,Model } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/db/data.db'
  });

const User = sequelize.define('User', {
    // Model attributes are defined here
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }, 
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
      }
  });
  (async () => {
    await sequelize.sync({ force: true });
    //const jane = await User.create({ firstName: "Ina" ,lastName:"Karter"});
    //console.log(jane.toJSON());
  })();
module.exports = User;