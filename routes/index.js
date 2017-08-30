const express = require('express');
const router = express.Router();
const AlgorithmStarter = require('./objects/AlgorithmStarter');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'zteApplication'});
});

router.get('/getData', function(req, res, next) {
    res.render('index', { title: 'zteApplication'});
    AlgorithmStarter.getDataFromZTMAndSaveItToSVC();
});

module.exports = router;

