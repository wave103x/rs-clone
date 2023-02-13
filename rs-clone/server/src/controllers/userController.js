// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const { user } = require('../../db/models');

const signUpUser = async (req, res) => {
  console.log(req.body);
  try {
    const {
      login, nickName, password,
    } = req.body;
    const currentUser = await user.findOne({ where: { login } });
    if (currentUser) {
      return res.status(400).json({ message: `User with login ${login} already exists` });
    }
    const hashPassword = await bcrypt.hash(password, 15);
    const newUser = await user.create({ login, nickName, hashPassword });
    return res.json(newUser);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const currentUser = await user.findOne({ where: { id: Number(id) } });
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = { getUser, signUpUser };
