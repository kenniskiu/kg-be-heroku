'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentSubject.init({
    subject_id: {type:DataTypes.STRING,primaryKey:true},
    student_id: {type:DataTypes.STRING,primaryKey:true},
    date_taken: DataTypes.DATE,
    status: DataTypes.STRING,
    final_score: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'student_subjects',
  });
  return StudentSubject;
};