"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Document extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Document.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			content: DataTypes.TEXT,
			file: DataTypes.STRING,
			link: DataTypes.TEXT,
			description: DataTypes.TEXT,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "documents",
		}
	);
	return Document;
};
