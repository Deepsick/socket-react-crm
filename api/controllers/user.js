const { join } = require('path');

const mongoose = require('mongoose');

const User = require(join(__dirname, '..', '..', 'models', 'user'));
const Permission = require(join(__dirname, '..', '..', 'models', 'permission'));

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (!users.length) {
      res.status(404).json({ message: 'No users in DB'});
    }
    const usersWithPermission = await User.populate(users, { path: 'permission' });
    res.status(200).json(usersWithPermission);
  } catch(err) {
    console.error(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await User.deleteOne({ _id: mongoose.Types.ObjectId(id) });

  if (!deletedUser) {
    return res.status(404).json({ message: 'Something went wrong' });
  }

  res.status(200).json(deletedUser);
};

exports.patchPermission = async (req, res, next) => {
  const { id } = req.params;
  const { chat, news, settings } = req.body.permission;

  const user = await User.findOne(
    {
      _id: mongoose.Types.ObjectId(id)
    }
  );
  const userWithRights = await User.populate(user, { path: 'permission' });
  const updatedPermission = await Permission.findOneAndUpdate(
    {
      _id: userWithRights.permission._id
    },
    {
      $set: {
        chat, news, settings
      }
    }
  );

  res.status(200).json(updatedPermission);
};