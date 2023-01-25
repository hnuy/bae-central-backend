import { Model, Sequelize } from "sequelize"
module.exports = (
  sequelize: Sequelize,
  DataTypes: { STRING: string; FLOAT: any }
) => {
  class material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  material.init(
    {
      matNo: DataTypes.STRING,
      matName: DataTypes.STRING,
      sizeL: DataTypes.STRING,
      sizeW: DataTypes.STRING,
      sizeH: DataTypes.STRING,
      ratio: DataTypes.FLOAT,
      partType: DataTypes.STRING,
      spec: DataTypes.STRING,
      factory: DataTypes.STRING,
      wipQtyBox: DataTypes.FLOAT
    },

    {
      sequelize,
      createdAt: false,
      updatedAt: false,
      tableName: "materials"
    }
  )
  material.removeAttribute("id")

  return material
}
