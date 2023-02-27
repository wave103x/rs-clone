module.exports = class UserDto {
  nickName;

  id;

  constructor(model) {
    this.nickName = model.nick_name;
    this.id = model.id;
  }
};
