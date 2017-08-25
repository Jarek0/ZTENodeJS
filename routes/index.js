const md5 = require('md5');
const axios = require('axios');
const sha1 = require('sha1');

const express = require('express');
const router = express.Router();

let url = 'https://www.ztm.lublin.eu/api/query';
let clientId = '5239';
let apiSecret = 'b178e311df3baaae4e0ebfe9a92ee2c9';

function getDataFromZTMAndSaveItToSVC(){
    let apiKey = md5((Math.floor(new Date().getTime() / 1000)).toString().concat(apiSecret));
    let sha1Code = sha1((apiKey).toString().concat(clientId).concat(apiSecret));
    let auth = {
        clientId: clientId,
        apiKey: apiKey,
        sha: sha1Code
    };
    let getBusesJson = {
        method: 'busstops',
        auth: auth
    };


    axios({
        method: 'post',
        url: url,
        data: getBusesJson,
        headers:{
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
        console.log(response.data);
})
.catch((error) => {
        console.log(error);
});
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'zteApplication'});
});

router.get('/getData', function(req, res, next) {
    res.render('index', { title: 'zteApplication'});
    getDataFromZTMAndSaveItToSVC();
});

module.exports = router;