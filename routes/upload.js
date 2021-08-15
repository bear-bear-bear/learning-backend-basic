const path = require("path");
const multer = require('multer');
const router = require('express').Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', (req, res) => {
  const PUBLIC_DIR = req.app.get('PUBLIC_DIR');
  res.sendFile(path.join(PUBLIC_DIR, 'multipart.html'));
});

router.post('/', upload.array('image'), (req, res) => {
  res.send('ok');
});

module.exports = router;
