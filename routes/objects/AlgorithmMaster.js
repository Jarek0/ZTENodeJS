const Network = require('./Network');
const RequestDataGetter = require('./RequestDataGetter');

module.exports = {
    getDataFromZTMAndSaveItToSVC: function(){
        let schedules = Network.getSchedulesDataFromZTE(
            [
                RequestDataGetter.getSchedulesRequestData()
            ]
        );
        console.log(schedules);
    }
};
