const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class tryoutparts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tryoutparts.init(
    {
      partNo: DataTypes.STRING,
      partName: DataTypes.STRING,
      EO: DataTypes.STRING,
      CL: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: false,
      updatedAt: false,
      tableName: "tryoutparts",
    }
  )
  tryoutparts.removeAttribute("id")

  return tryoutparts
}
