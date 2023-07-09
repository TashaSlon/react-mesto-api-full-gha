const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-err');

module.exports = (req, res, next) => {
  const YOUR_JWT = req.cookies.jwt;
  const SECRET_KEY_DEV = 'dev-secret';
  try {
    const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
    req.user = payload;
    console.log('\x1b[31m%s\x1b[0m', `
    Надо исправить. В продакшне используется тот же
    секретный ключ, что и в режиме разработки.
    `);
  } catch (err) {
    if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
      console.log(
        '\x1b[32m%s\x1b[0m',
        'Всё в порядке. Секретные ключи отличаются',
      );
    } else {
      console.log(
        '\x1b[33m%s\x1b[0m',
        'Что-то не так',
        err,
      );
    }
    next(new NotAuthError('Необходима авторизация'));
  }

  next();
};
