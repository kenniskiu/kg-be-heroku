'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Material.init({
    id: {type:DataTypes.STRING,primaryKey:true},
    session_id: DataTypes.STRING,
    subject_id: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    id_referrer: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'materials',
  });
  return Material;
};