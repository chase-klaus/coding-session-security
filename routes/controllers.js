const { default: validator } = require('validator');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { createUser, getUserByEmail, createClient } = require('../models/crud');
const logger = require('../logger');

const { TOKEN_TTL, SALT_ROUNDS } = process.env;

exports.createUserCtrl = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Bad Request', status: 400 });
  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Bad Request. Email is incorrect', status: 400 });
  if (!/^(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*\d)(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*[a-z])(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*[A-Z])(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*[!@#$%^&*_\-+=~:;?.]).{8,}$/.test(password)) return res.status(400).json({ error: 'Bad Request. Password is too weak', status: 400 });

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const pid = uuid().replace(/-/g, '');
    const cid = uuid().replace(/-/g, '');
    const secret = uuid().replace(/-/g, '');

    const user = await createUser({
      email,
      password: hash,
      pid,
      cid,
      secret,
    });

    if (!user) res.status(409).json({ error: 'Conflict', status: 409 });
    if (user.error) throw new Error();

    const token = sign({
      pid: user.pid,
    }, user.secret, { expiresIn: TOKEN_TTL });

    res.status(200).json({
      pid: user.pid,
      cid: user.cid,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', status: 500 });
  }
};

exports.loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Bad Request', status: 400 });
  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Bad Request. Email is incorrect', status: 400 });

  try {
    const user = await getUserByEmail(email);
    if (!user) res.status(401).json({ error: 'Not authorized', status: 401 });
    if (user.error) throw new Error();

    const result = await bcrypt.compare(password, user.password);
    if (!result) res.status(401).json({ error: 'Not authorized', status: 401 });

    const cid = uuid().replace(/-/g, '');
    const secret = uuid().replace(/-/g, '');

    const client = await createClient({
      pid: user.pid,
      cid,
      secret,
    });

    const token = sign({
      pid: user.pid,
    }, client.secret, { expiresIn: TOKEN_TTL });

    res.status(200).json({
      pid: user.pid,
      cid: client.cid,
      token,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error', status: 500 });
  }
};

exports.authUserCtrl = async (req, res) => {
  const { cid, pid, secret } = req.user;

  const token = sign({
    pid,
  }, secret, { expiresIn: TOKEN_TTL });

  res.status(200).json({
    pid,
    cid,
    token,
  });
};
