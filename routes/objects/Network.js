const axios = require('axios');
const Utils = require('./Utils');
const Auth = require('./Auth');
const AlgorithmStarter = require('./AlgorithmStarter');
const DataHandler = require('./DataHandler');

let url = 'https://www.ztm.lublin.eu/api/query';

let auth = Auth.getAuth();

let dataFromZTE;

module.exports = {
    getDataFromZTE(requestObjectWrapperFunctions){
        let promises = this.createPromises(requestObjectWrapperFunctions);
        this.getLinesAndSchedulesResponse(promises);
    },

    createPromises: function(requestParams){
        return requestParams.map(
            (requestParam) => {
                let data = {
                    auth: auth
                };
                Utils.copyPropsToAnotherObject(requestParam, data);
                return axios({
                    method: 'post',
                    url: url,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        )
    },

    sendRequest(promises){
        return axios.all(promises)
            .then((responses) => {
                    return responses.map(response => {
                        return {
                            method:JSON.parse(response.config.data).method,
                            data:response.data.response
                        }
                    });
                }
            )
    },


    getLinesAndSchedulesResponse: function(promises) {
        this.sendRequest(promises).then( (responseData) =>{
                this.handleLinesAndSchedulesResponse(responseData);
            }
        )
            .catch((error) => {
                console.log(error);
            });
    },

    handleLinesAndSchedulesResponse: function(responseData){
        let lines = responseData.find(obj => {return obj.method === 'lines'}).data;
        let schedules = responseData.find(obj => {return obj.method === 'schedules'}).data;

        for(let line in lines)
            schedules.forEach(
                schedule => {
                    this.getDataFromZTE(
                        AlgorithmStarter.getLineRequestData(
                            line.key,
                            schedule.id
                        ),
                        this.getLineResponse
                    )
                }
            )
    },

    getLineResponse: function(promises){
        this.sendRequest(promises).then( (responseData) =>{
                this.handleLineResponse(responseData);
            }
        )
            .catch((error) => {
                console.log(error);
            });
    },

    handleLineResponse: function(responseData){
        console.log(responseData);
    }

};