const Network = require('./Network');
const RequestDataGetter = require('./RequestDataGetter');

module.exports = {
    getDataFromZTMAndSaveItToSVC: function(){
        Network.getDataFromZTE(
            [
                RequestDataGetter.getSchedulesRequestData(),
                RequestDataGetter.getLinesRequestData(),
                RequestDataGetter.getBusstopsRequestData()
            ]
        )
    }
};
