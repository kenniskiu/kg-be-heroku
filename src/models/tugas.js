'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tugas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tugas.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    pertemuan_id: DataTypes.STRING,
    durasi: DataTypes.INTEGER,
    deskripsi: DataTypes.STRING,
    konten: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tugas',
  });
  return Tugas;
};