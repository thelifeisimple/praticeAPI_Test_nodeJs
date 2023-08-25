const sequelize = require('./../../src/db/sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const { models } = sequelize;

const umzug = new Umzug({
    migrations:{glob: './src/db/seeders/*.js'},
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize })
})

const upSeed = async () => {
    try {
       await sequelize.sync({ force:true });
       await umzug.up();
    } catch (error) {
        console.error(error);
    }
}

const downSeed = async () => {
    await sequelize.drop();
}

module.exports = {upSeed, downSeed}