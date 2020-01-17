const { join } = require('path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validator = require(join(__dirname, '..', '..', 'validators', 'auth'));
require('dotenv').config({
  path: join(__dirname, '..', '.env'),
});

const User = require(join(__dirname, '..', '..', 'models', 'user'));
const Permission = require(join(__dirname, '..', '..', 'models', 'permission'));

const formatDate = (mseconds) => Date.now() + +mseconds;
const createTokens = (payload) => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRED });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRED });

  return {
    accessToken: token,
    accessTokenExpiredAt: formatDate(process.env.TOKEN_EXPIRED),
    refreshToken: refreshToken,
    refreshTokenExpiredAt: formatDate(process.env.REFRESH_TOKEN_EXPIRED),
  };
};

exports.postRegistration = async (req, res ,next) => {
  const { username, surName, firstName, middleName, password } = req.body;

  try {
    await validator.postRegistration.validateAsync({ username, surName, firstName, middleName, password });
  }
  catch (err) {
    return res.status(403).json({ message: err.details[0].message });
  }

  try {
    const user = await User.findOne( { username });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 8);
    const permission = new Permission();
    await permission.save();
    
    const newUser = new User({
      username,
      surName,
      firstName,
      middleName,
      permission,
      password: hashPassword,
      ...createTokens({
        username,
      }),
    });

    const savedUser = await newUser.save();
    const authorizedUser = await User.populate(savedUser, { path: 'permission' });
    res.status(200).json(authorizedUser);
  } catch(err) {
    console.error(err);
  }
};

exports.postLogin = async (req, res ,next) => {
  const  { username, password } = req.body;

  try {
    await validator.postLogin.validateAsync({ username, password });
  }
  catch (err) {
    return res.status(403).json({ message: err.details[0].message });
  }

  try {
    const user = await User.findOne( { username });
    if (!user) {
      return res.status(404).json({ message: 'User doesnt exist' }); 
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) { 
      return res.status(403).json({ message: 'Wrong data' });
    }
    const tokens = createTokens({
      username,
    });

    const updatedUser = await User.findOneAndUpdate( 
      {
        username
      },
      {
        $set: tokens,
      }
    );
    const authorizedUser = await User.populate(updatedUser, { path: 'permission' });
    return res.status(200).json(authorizedUser);
  } catch(err) {
    console.error(err);
  }
};

exports.postRefreshToken = async (req, res ,next) => {
  const { username } = req.body;

  try {
    await validator.postRefreshToken.validateAsync({ username });
  }
  catch (err) {
    return res.json({ message: err.details[0].message });
  }

  const tokens = createTokens({
    username,
  });
  try {
    const updatedUser = await User.findOneAndUpdate( 
      {
        username
      },
      {
        $set: tokens,
      }
    );
    if (!updatedUser) {
      return res.json({ message: 'User not found' });
    }
    
    res.headers['authorization'] = tokens.accessToken;
    res.json(tokens);
  } catch(err) {
    console.error(err);
  }
};