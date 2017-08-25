const axios = require('axios');
const Utils = require('./Utils');
const Auth = require('./Auth');
const AlgorithmManager = require('./AlgorithmStarter');
const DataHandler = require('./DataHandler');

let url = 'https://www.ztm.lublin.eu/api/query';

let auth = Auth.getAuth();

module.exports = {
    getDataFromZTE(requestObjectWrapperFunctions){
        let promises = this.createPromises(requestObjectWrapperFunctions);
        this.getResponse(promises);
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

    getResponse: function(promises) {
        axios.all(promises)
            .then((responses) => {
                    return responses.map(response => {
                        return {
                            key:JSON.parse(response.config.data).method,
                            data:response.data.response
                        }
                    });
                }
            )
            .then( (responseData) =>{
                    DataHandler.handleData(responseData);
                }
            )
            .catch((error) => {
                console.log(error);
            });
    },

};