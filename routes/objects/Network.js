const axios = require('axios');
const Utils = require('./Utils');
const Auth = require('./Auth');

let url = 'https://www.ztm.lublin.eu/api/query';

let auth =Auth.getAuth();

let responseData;

module.exports = {
    getBusstops: function () {
        this.sendPostRequest({method: "busstops"})
    },

    getBusstop: function(idBusstop, idSchedule) {
        this.sendPostRequest({
            method: "busstop",
            schedule_id: idSchedule,
            busstop_no: idBusstop,
        })
    },

    getLines: function() {
        this.sendPostRequest({method: "lines"})
    },

    getLine: function(nrLine, idSchedule) {
        this.sendPostRequest({
            method: "line",
            line_no: nrLine,
            schedule_id: idSchedule
        })
    },

    getLineAtBusstop: function(nrLine, idSchedule, idBusstop) {
        this.sendPostRequest({
            method: "lineAtBusstop",
            schedule_id: idSchedule,
            line_no: nrLine,
            busstop_no: idBusstop,
        })
    },

    getSchedules: function() {
        this.sendPostRequest({
            method: "schedules"
        })
    },

    sendPostRequest: function(params) {

        return new Promise((resolve, reject) => {
            let data = {
                auth: auth
            };

            Utils.copyPropsToAnotherObject(params, data);

            axios({
                method: 'post',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(
                (data) => {
                    console.log(data);
                }
            )
                .catch((error) => {
                    console.log(error);
                });
        });
    },

    handleResponse: function() {
        return responseData;
    }
};