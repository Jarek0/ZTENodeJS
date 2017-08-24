const express = require('express');
const router = express.Router();
const Network = require('./objects/Network');

function getDataFromZTMAndSaveItToSVC(){
    console.log(Network.getBusstops());
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getDataFromZTMAndSaveItToSVC();
  res.render('index', { title: 'zteApplication'});
});

module.exports = router;
