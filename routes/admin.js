var express = require('express');
var router = express.Router();
//Debian
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admLoginForm');
});

module.exports = router;
