const { join } = require('path');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const validator = require(join(__dirname, '..', '..', 'validators', 'news'));

const News = require(join(__dirname, '..', '..', 'models', 'news'));
const User = require(join(__dirname, '..', '..', 'models', 'user'));

require('dotenv').config({
  path: join(__dirname, '..', '.env'),
});

exports.getNews = async (req, res, next) => {
  try {
    const news = await News.find({});
    
    if (!news.length) {
      return res.status(404).json({ message: 'No news in DB'});
    }

    const newsWithAuthor = await News.populate(news, { path: 'user' });
    res.status(200).json(newsWithAuthor);
  } catch(err) {
    console.error(err);
  }
};



exports.postNews = async (req, res, next) => {
  const { text, title } = req.body;

  try {
    await validator.postNews.validateAsync({ text, title });
  }
  catch (err) {
    return res.status(403).json({ message: err.details[0].message });
  }

  const token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Authorization error' });
  }

  const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
  if (!decoded) {
    return res.status(401).json({ message: 'Authorization error' });
  }
  const { username } = decoded;
  try {
    const user = await User.findOne({ username });
    const news = new News({
      text,
      title,
      user,
    });
    await news.save();
    exports.getNews(req, res, next);
  } catch(err) {
    console.error(err);
  }
};

exports.patchNews = async (req, res, next) => {
  const { id } = req.params;
  const { text, title } = req.body;

  try {
    await validator.patchNews.validateAsync({ text, title });
  }
  catch (err) {
    return res.status(403).json({ message: err.details[0].message });
  }

  try {
    await News.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $set: { text, title },
      }
    );
    exports.getNews(req, res, next);
  } catch(err) {
    console.error(err);
  }
};

exports.deleteNews = async(req, res, next) => {
  const { id } = req.params;
  try {
    await News.deleteOne({ _id: mongoose.Types.ObjectId(id) });
    exports.getNews(req, res, next);
  } catch(err) {
    console.error(err);
  }
};