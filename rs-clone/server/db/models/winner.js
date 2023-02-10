const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class winner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
    //  */
    // static associate(models) {
    //   // define association here
    // }
  }
  winner.init({
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: 'user',
      },
    },
    score: {
      type: DataTypes.INTEGER,
      field: 'score',
    },
    time: {
      type: DataTypes.INTEGER,
      field: 'time',
    },
    alive_cells: {
      type: DataTypes.INTEGER,
      field: 'alive_cells',
    },
  }, {
    sequelize,
    modelName: 'winner',
    tableName: 'winner',
    underscored: true,
    freezeTableName: true,
  });
  return winner;
};
