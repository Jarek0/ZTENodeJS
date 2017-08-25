
module.exports = {
    copyPropsToAnotherObject: function (firstObject,secondObject){
        for(let k in firstObject) secondObject[k]=firstObject[k];
    }
};

