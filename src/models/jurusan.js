'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurusan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jurusan.init({
    id: { type: DataTypes.STRING, primaryKey:true },
    nama: DataTypes.STRING,
    pelajaran: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'jurusan',
  });
  return jurusan;
};