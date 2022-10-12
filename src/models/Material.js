"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Material extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Assignment,{
				foreignKey:"id_referrer",
				targetKey:"id"
			})
			this.belongsTo(models.Module,{
				foreignKey:"id_referrer",
				targetKey:"id"
			})
			this.belongsTo(models.Quiz,{
				foreignKey:"id_referrer",
				targetKey:"id"
			})
		}
	}
	Material.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			session_id: DataTypes.UUID,
			subject_id: DataTypes.UUID,
			description: DataTypes.STRING,
			type: DataTypes.STRING,
			id_referrer: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
			deleted_at: DataTypes.DATE,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
		},
		{
			sequelize,
			tableName: "materials",
		}
	);
	return Material;
};
