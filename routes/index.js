const express = require('express');
const router = express.Router();
const AlgorithmManager = require('./objects/AlgorithmMaster');


/* GET home page. */
router.get('/', function(req, res, next) {
    AlgorithmManager.getDataFromZTMAndSaveItToSVC();
  res.render('index', { title: 'zteApplication'});
});

module.exports = router;
