'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class module_document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  module_document.init({
    module_id: {type:DataTypes.STRING,primaryKey:true},
    document_id:{type:DataTypes.STRING,primaryKey:true}
  }, {
    sequelize,
    modelName: 'module_document',
  });
  return module_document;
};