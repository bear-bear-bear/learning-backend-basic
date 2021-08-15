const path = require("path");
const router = require('express').Router();

// GET / 라우터
router.get('/', (req, res) => {
  const PUBLIC_DIR = req.app.get('PUBLIC_DIR');
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

module.exports = router;
