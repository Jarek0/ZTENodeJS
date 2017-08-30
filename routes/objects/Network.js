const axios = require('axios');
const Utils = require('./Utils');
const Auth = require('./Auth');
const Time = require('./Time');
const AlgorithmStarter = require('./AlgorithmStarter');
const DataHandler = require('./DataHandler');
const RequestDataGetter = require('./RequestDataGetter');

let url = 'https://www.ztm.lublin.eu/api/query';

let auth = Auth.getAuth();

let dataFromZTE;
let busStops;
let busStopsOnLine = {};

module.exports = {
    getDataFromZTE(requestParamsWrapper){
        let promises = this.createPromises(requestParamsWrapper);
        this.getLinesSchedulesAndBusStopsResponse(promises);
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

    sendLinesSchedulesAndBusStopsRequest: function(promises){
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


    getLinesSchedulesAndBusStopsResponse: function(promises) {
        this.sendLinesSchedulesAndBusStopsRequest(promises).then( (responseData) =>{
                this.handleLinesSchedulesAndBusesResponse(responseData);
            }
        )
            .catch((error) => {
                console.log(error);
            });
    },

    handleLinesSchedulesAndBusesResponse: function(responseData){
        let lines = responseData.find(obj => {return obj.method === 'lines'}).data;
        let schedules = responseData.find(obj => {return obj.method === 'schedules'}).data;
        busStops = responseData.find(obj => {return obj.method === 'busstops'}).data;
        if(schedules.length===2) {
            let handleSchedules = (schedules[0].date_start > schedules[1].date_start) ? schedules[0] : schedules[1];
            schedules = [];
            schedules.push(handleSchedules);
        }
        let lineRequestData = [];

        for(let line in lines)
            schedules.forEach(
                schedule => {
                    lineRequestData.push(RequestDataGetter.getLineRequestData(
                            line,
                            schedule.id));

                }
            )
        let linePromises=this.createPromises(lineRequestData);
        console.log(linePromises.length);
        console.log(busStops.length);
        this.getLineResponse(linePromises);
    },


    getLineResponse: function(promises){
        this.sendLineRequest(promises).then( (responseData) =>{
                this.handleLineResponse(responseData);
            }
        )
            .catch((error) => {
                console.log(error);
            });
    },

    sendLineRequest: function(promises){
        return axios.all(promises)
            .then((responses) => {
                    return responses.map(response => {
                        return {
                            line_no:JSON.parse(response.config.data).line_no,
                            schedule_id:JSON.parse(response.config.data).schedule_id,
                            data:response.data.response
                        }
                    });
                }
            )
    },

    handleLineResponse: function(lineResponses){
        busStopsOnLine = [];

        let lineAtBusstopRequestData = [];

        lineResponses.forEach(
            lineResponse =>{
                if(lineResponse.data!==undefined)
                lineResponse.data.forEach(
                    lineResponseData => {
                        lineResponseData.data.forEach(
                            busStopData => {
                                let busStopOnLine = {};
                                busStopOnLine.line_no = lineResponse.line_no;
                                busStopOnLine.schedule_id = lineResponse.schedule_id;
                                busStopOnLine.direction_name = lineResponseData.direction_name;
                                busStopOnLine.id = busStopData.busstop;
                                busStopOnLine.position = busStopData.position-1;
                                
                                let busStop = busStops.find(busStop => {return busStop.id === busStopOnLine.id});
                                busStopOnLine.latitude = busStop.latitude;
                                busStopOnLine.longitude = busStop.longitude;

                                lineAtBusstopRequestData.push(
                                    RequestDataGetter.getLineAtBusstopRequestData(
                                        busStopOnLine.line_no,
                                        busStopOnLine.schedule_id,
                                        busStopOnLine.id
                                    )
                                );



                                busStopsOnLine.push(busStopOnLine);
                            }
                        )
                    }
                );
            }
        );

        let lineAtBusStopPromises=this.createPromises(lineAtBusstopRequestData.slice(1, 100));

        this.getLineAtBusStopResponse(lineAtBusStopPromises);
    },

    getLineAtBusStopResponse: function(lineAtBusStopPromises){
        this.sendLineAtBusStopRequest(lineAtBusStopPromises).then( (responseData) =>{
                this.handleLineAtBusStopResponse(responseData);
            }
        )
            .catch((error) => {
                console.log(error);
            });
    },

    sendLineAtBusStopRequest: function(promises){
        return axios.all(promises)
            .then((responses) => {
                    return responses.map(response => {
                        return {
                            line_no:JSON.parse(response.config.data).line_no,
                            schedule_id:JSON.parse(response.config.data).schedule_id,
                            busstop_no:JSON.parse(response.config.data).busstop_no,
                            data:response.data.response
                        }
                    });
                }
            )
    },


    handleLineAtBusStopResponse(lineAtBusStopResponses){
        //console.log(busStops);
        //console.log(busStopsOnLine);
        //console.log(lineAtBusStopResponses);
        Time.controller(busStopsOnLine,lineAtBusStopResponses);
    }
};