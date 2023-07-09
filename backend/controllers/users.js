require('dotenv').config();
const jwtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotAllowError = require('../errors/not-allow-err');
const ExistError = require('../errors/exist-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const { JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then((user) => res.status(201).send({
        email: user.email,
        name,
        about,
        avatar,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ExistError('При регистрации указан email, который уже существует на сервере'));
        } else
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Некорректные данные при создании карточки'));
        } else {
          next(err);
        }
      }))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jwtoken.sign({
              _id: user._id,
            }, JWT_SECRET);
            res.cookie('jwt', jwt, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });
            res.send({ token: jwt });
          } else {
            throw new NotAllowError('Указаны неверные логин или пароль');
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};
