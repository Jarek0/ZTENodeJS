const Network = require('./Network');

module.exports = {
    getBusstopsRequestData: function () {
        return {method: "busstops"};
    },

    getBusstopRequestData: function(idBusstop, idSchedule) {
        return {
            method: "busstop",
            schedule_id: idSchedule,
            busstop_no: idBusstop,
        };
    },

    getLinesRequestData: function() {
        return {method: "lines"};
    },

    getLineRequestData: function(nrLine, idSchedule) {
        return {
            method: "line",
            line_no: nrLine,
            schedule_id: idSchedule
        };
    },

    getLineAtBusstopRequestData: function(nrLine, idSchedule, idBusstop) {
        return {
            method: "lineAtBusstop",
            schedule_id: idSchedule,
            line_no: nrLine,
            busstop_no: idBusstop,
        };
    },

    getSchedulesRequestData: function() {
        return {
            method: "schedules"
        };
    },

    getDataFromZTMAndSaveItToSVC: function(){
        Network.getDataFromZTE(
            [this.getBusstopsRequestData(),
            this.getLinesRequestData()]
        )
    }
};
