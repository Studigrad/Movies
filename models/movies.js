const sqlite3 = require('sqlite3').verbose();
const { Sequelize,DataTypes,Model } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/db/data.db'
  });

const Movie = sequelize.define('Movie', {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING
    },
    year: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }, 
    format: {
        type: DataTypes.STRING
        // allowNull defaults to true
      },
      stars: {
        type: DataTypes.STRING
        // allowNull defaults to true
      }
  });
  (async () => {
    await sequelize.sync({ force: true });
    //const jane = await User.create({ firstName: "Ina" ,lastName:"Karter"});
    //console.log(jane.toJSON());
  })();
module.exports = Movie;