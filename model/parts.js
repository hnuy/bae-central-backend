const { Model } = require("sequelize")

module.exports = (
  sequelize,
  DataTypes
) => {
  class parts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  parts.init(
    {
      partNo: DataTypes.STRING,
      partName: DataTypes.STRING,
      customer: DataTypes.STRING,
      model: DataTypes.STRING,
      cost: DataTypes.FLOAT,
      leadTime: DataTypes.INTEGER,
      stamp: DataTypes.INTEGER,
      weld: DataTypes.INTEGER,
      arcweld: DataTypes.INTEGER,
      plate: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: false,
      updatedAt: false,
      tableName: "parts",
    }
  )
  parts.removeAttribute("id")

  return parts
}
