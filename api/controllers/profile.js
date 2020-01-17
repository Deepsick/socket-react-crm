const { join } = require('path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');

const validator = require(join(__dirname, '..', '..', 'validators', 'profile'));

const User = require(join(__dirname, '..', '..', 'models', 'user'));

require('dotenv').config({
  path: join(__dirname, '..', '.env'),
});

exports.getProfile = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['authorization'];
  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
      if (!decoded) {
        return res.status(401).json({ message: 'Authorization error' });
      }
      const { username } = decoded;
      const user = await User.findOne({ username });
      const authorizedUser = await User.populate(user, { path: 'permission' });
      const { firstName, middleName, surName, avatar, permission, id } = authorizedUser;
      res.status(200).json({ username, firstName, middleName, surName, image: avatar, permission, id});
    } catch(err) {
      console.error(err);
    }
  }
};

exports.patchProfile = async (req, res, next) => {
  const { firstName, middleName, surName, oldPassword, newPassword } = req.body;

  try {
    await validator.patchProfile.validateAsync({ firstName, middleName, surName, oldPassword, newPassword });
  }
  catch (err) {
    return res.status(403).json({ message: err.details[0].message });
  }

  const token = req.body.token || req.query.token || req.headers['authorization'];
  const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
  const { username } = decoded;

  const profileUser = { firstName, middleName, surName };
  if (req.file) {
    const { destination, originalname } = req.file;
    profileUser.avatar = destination.replace('public', '') + originalname.toLowerCase();
    try {
      const serverImagePath = destination + originalname.toLowerCase();
      const image = await Jimp.read(serverImagePath);
      await image
        .resize(384, 384)
        .quality(60)
        .write(serverImagePath);
    } catch (err) {
      console.error(err);
    }
  }
  if (oldPassword && newPassword && newPassword !== oldPassword) {
    try {
      const user = await User.findOne( { username });
      const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordMatched) { 
        return res.status(403).json({ message: 'Wrong password' });
      }

      const hashPassword = await bcrypt.hash(newPassword, 8);
      profileUser.password = hashPassword;
    } catch(err) {
      console.error(err);
    }
  }
  try {
    const updatedUser = await User.findOneAndUpdate( 
      {
        username
      },
      {
        $set: profileUser,
      },
      {
        returnOriginal: false, 
      }
    );
    const authorizedUser = await User.populate(updatedUser, { path: 'permission' });
    res.status(200).json({
      firstName: authorizedUser.firstName,
      middleName: authorizedUser.middleName,
      image: authorizedUser.avatar,
      surName: authorizedUser.surName,
      username,
      permission: authorizedUser.permission,
    });
  } catch(err) {
    console.error(err);
  }
};