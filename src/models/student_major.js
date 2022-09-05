'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentMajor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentMajor.init({
    id:{type:DataTypes.UUID,primaryKey:true},
    major_id: DataTypes.UUID,
    student_id: DataTypes.UUID,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'student_majors',
  });
  return StudentMajor;
};