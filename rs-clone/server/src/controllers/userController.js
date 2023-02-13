/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('../../config');
const { user } = require('../../db/models');

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const signUpUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Ошибка при регистрации' });
    }
    const {
      login, nickName, password,
    } = req.body;
    const currentUser = await user.findOne({ where: { login } });
    if (currentUser) {
      return res.status(400).json({ message: `Пользователь с логином ${login} существует` });
    }
    const hashPassword = await bcrypt.hash(password, 15);
    const newUser = await user.create({ login, nickName, password: hashPassword });
    return res.json(newUser);
  } catch (e) {
    console.log(e);
    res.send({ message: 'Ошибка при регистрации' });
  }
};

const signInUser = async (req, res) => {
  try {
    const {
      login, password,
    } = req.body;
    const currentUser = await user.findOne({ where: { login } });
    if (!currentUser) {
      return res.status(400).json({ message: `Пользователь с логином ${login} не существует` });
    }
    const validPassword = await bcrypt.compareSync(password, currentUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неверный пароль!' });
    }
    const token = generateAccessToken(currentUser.id);
    return res.json({ id: currentUser.id, token });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Ошибка входа' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersList = await user.findAll();
    res.json(usersList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
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

module.exports = {
  getUser, getAllUsers, signUpUser, signInUser,
};
