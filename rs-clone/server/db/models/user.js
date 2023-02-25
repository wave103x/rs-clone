const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
    static associate({ winner }) {
      this.hasMany(winner, { foreignKey: 'user_id' });
    }
  }
  user.init({
    login: {
      type: DataTypes.STRING,
      field: 'login',
    },
    nickName: {
      type: DataTypes.STRING,
      field: 'nick_name',
    },
    password: {
      type: DataTypes.STRING,
      field: 'password',
    },
    image: {
      type: DataTypes.STRING,
      field: 'image',
    },
    refreshToken: {
      type: DataTypes.STRING,
      field: 'refresh_token',
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    underscored: true,
    freezeTableName: true,
  });
  return user;
};
