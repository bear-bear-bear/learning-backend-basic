const express = require('express');
const path = require('path');
const fs = require("fs");
const dotenv = require('dotenv');
const session = require('express-session');
const multer = require('multer');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 새로 생성합니다.');
  fs.mkdirSync('uploads');
}

const app = express();
app.set('PORT', process.env.PORT || 3000);
app.set('PUBLIC_DIR', path.resolve(__dirname, 'public'));
app.set('UPLOAD_DIR', path.resolve(__dirname, 'uploads'));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/', express.static(app.get('PUBLIC_DIR')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().array());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/upload', uploadRouter);

app.use((req, res, _) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, _) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('PORT'), () => {
  console.log(`http://localhost:${app.get('PORT')}`);
});
