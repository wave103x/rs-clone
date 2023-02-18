/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { user } = require('../../db/models');

const generateAccessToken = (id) => {
  const payload = { id };
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
  const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, { expiresIn: '30d' });
  return ({ accessToken, refreshToken });
};

const saveToken = async (id, refreshToken) => {
  const currentUser = await user.findOne({ where: { id } });
  if (currentUser.refreshToken) {
    const newToken = await user.update(
      { refreshToken },
      { where: { id } },
    );
    return newToken;
  }
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
      return res.status(401).json({ message: `Пользователь с логином ${login} существует` });
    } if (currentUserNick.length > 0) {
      return res.status(403).json({ message: `Никнейм ${nickName} занят` });
    }
    const hashPassword = await bcrypt.hash(password, 15);
    const newUser = await user.create({ login, nickName, password: hashPassword });

    const tokens = generateAccessToken(newUser.id);

    await saveToken(newUser.id, tokens.refreshToken);
    res.cookie('refresh', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.status(201)
      .json({ id: newUser.id, nickName: newUser.nickName });
  } catch (error) {
    console.log(error);
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
      return res.status(401).json({ message: `Пользователь с логином ${login} не существует` });
    }
    const validPassword = await bcrypt.compareSync(password, currentUser.password);
    if (!validPassword) {
      return res.status(402).json({ message: 'Неверный пароль!' });
    }
    const tokens = generateAccessToken(currentUser.id);
    await saveToken(currentUser.id, tokens.refreshToken);
    res.cookie('refresh', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.status(201)
      .json({ id: currentUser.id, nickName: currentUser.nickName });
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
  const { refresh } = req.cookies;
  if (refresh) {
    const decodedData = jwt.verify(refresh, process.env.SECRET_REFRESH_KEY);
    const { id, exp } = decodedData;
    if (exp * 1000 > Date.now()) {
      try {
        const currentUser = await user.findOne({ where: { id: Number(id) } });
        return res.status(201)
          .json({ id: currentUser.id, nickName: currentUser.nickName });
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    }
  } else {
    res.sendStatus(404);
  }
};

const logOut = async (req, res) => {
  const { refresh } = req.cookies;
  try {
    const { id } = req.params;
    const loggedOutUser = await user.update(
      {
        refreshToken: '',
      },
      { where: { id: Number(id) } },
    );
    res.clearCookie('refresh');
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getUser, getAllUsers, signUpUser, signInUser, logOut,
};
