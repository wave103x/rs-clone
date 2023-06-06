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
    static associate({ user }) {
      this.belongsTo(user);
    }
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
    aliveCells: {
      type: DataTypes.INTEGER,
      field: 'alive_cells',
    },
    mode: {
      type: DataTypes.STRING,
      field: 'mode',
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
