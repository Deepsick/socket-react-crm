const { join } = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const slowDown = require('express-slow-down');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const authRoutes = require(join(__dirname, 'api', 'routes', 'auth'));
const profileRoutes = require(join(__dirname, 'api', 'routes', 'profile'));
const userRoutes = require(join(__dirname, 'api', 'routes', 'user'));
const newsRoutes = require(join(__dirname, 'api', 'routes', 'news'));

const app = express();

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: 500,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});

app.enable('trust proxy');
app.use(speedLimiter);
app.use(limiter);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false, limit: 10000 }));
app.use(bodyParser.json({ limit: '2048kb' }));
app.use(express.static(join(__dirname, 'public')));

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.get('*', (req, res, next) => {
  res.sendFile(join(__dirname, 'index.html'));
});

module.exports = app;