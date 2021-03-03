const logger = require('../logger');
const { User, Client } = require('./models');

const createUser = async ({
  email,
  password,
  pid,
  cid,
  secret,
}) => {
  try {
    let user = await User.findOne({ where: { email } });
    if (user) return false;
    user = await User.create({ email, password, pid });
    const client = await Client.create({ cid, secret });
    client.userId = user.id;
    await client.save();
    return {
      pid: user.pid,
      cid: client.cid,
      secret: client.secret,
    };
  } catch (err) {
    logger.error(err);
    return { error: 'DB Connection error' };
  }
};

const createClient = async ({
  pid,
  cid,
  secret,
}) => {
  const user = await User.findOne({ where: { pid } });
  if (!user) return false;
  const client = await Client.create({ cid, secret });
  client.userId = user.id;
  await client.save();
  return {
    pid: user.pid,
    cid: client.cid,
    secret: client.secret,
  };
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (err) {
    logger.error(err);
    return { error: 'DB Connection error' };
  }
};

const getClient = async (cid) => {
  try {
    const client = await Client.findOne({ where: { cid } });
    return client;
  } catch (err) {
    logger.error(err);
    return { error: 'DB Connection error' };
  }
};

module.exports = {
  createClient,
  createUser,
  getClient,
  getUserByEmail,
};
