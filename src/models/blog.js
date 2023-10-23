'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blog.init({
    title: DataTypes.STRING,
    StartDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.STRING,
    distanceTime: DataTypes.STRING,
    technologies: DataTypes.STRING,
    image: DataTypes.STRING,
    author: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'blog',
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp'
  });


//cobacoba
module.exports = (sequelize) => {
  user.hasMany(sequelize.models.blog, { foreignKey: 'userId' });
};

module.exports = (sequelize) => {
  blog.belongsTo(sequelize.models.user, { foreignKey: 'userId' });
};


  return blog;
};