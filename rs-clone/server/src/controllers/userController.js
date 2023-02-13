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
    const currentUserNick = await user.findAll({ where: { nickName } });
    if (currentUser) {
      return res.status(400).json({ message: `Пользователь с логином ${login} существует` });
    } if (currentUserNick.length > 0) {
      return res.status(400).json({ message: `Никнейм ${nickName} занят` });
    }
    const hashPassword = await bcrypt.hash(password, 15);
    const newUser = await user.create({ login, nickName, password: hashPassword });
    const token = generateAccessToken(newUser.id);
    res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json(newUser);
    // return res.json(newUser);
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
    res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
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

const logOut = async (req, res) => {
  try {
    const { token } = req.cookies;
    res.clearCookie('token');
    return res.status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
module.exports = {
  getUser, getAllUsers, signUpUser, signInUser, logOut,
};
