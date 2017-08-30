let Export= require('./ExportToCSV');
function findTime(stopsArray) {
    if (stopsArray[0]) {
        let leavesArray = [];
        let keys = Object.keys(stopsArray[0].godziny);
        let i = loops(keys, stopsArray);
        for (let j = 0; j < stopsArray.length; j++) {
            keys = Object.keys(stopsArray[j].godziny);
            leavesArray.push(findingLoops(stopsArray[j], keys, i));
        }
        return leavesArray;
    }
}
function findingLoops(stopsArray, keys, i) {
    let z = 0;
    for(let x = 0;x<keys.length;x++){
        let minutes = stopsArray.godziny[keys[x]];
        for(let w = 0; w<minutes.length;w++){
            if(i===z){
                return {linia : stopsArray.linia, dir:stopsArray.direction_name, busstopId: stopsArray.przystanek, pos:stopsArray.position, leaveTime: minutes[w]};
            }
            z++;
        }
    }
}
function loops(keys, stopsArray){
    let i = 0;
    for(let x = 0;x<keys.length;x++){
        for(let j = 0;j<stopsArray[0].godziny[keys[x]].length;j++){
            if(parseInt(keys[x])===7){
                return i;
            }
            i++;
        }
    }
    return i;
}
function substractTime(leavesArray, busstopResponse){
    let ride = [];
    for(let i = 1; i<leavesArray.length; i++){
        ride[i-1]={};
                let first=leavesArray[i].leaveTime.charAt(0)+leavesArray[i].leaveTime.charAt(1);
                let second=leavesArray[i - 1].leaveTime.charAt(0)+leavesArray[i - 1].leaveTime.charAt(1);
                   let result = first - second;
                if (result < 0)
                    result += 60;
        //pobranie wspolrzednych przystanku
        let directionName = leavesArray[i].dir;
        let coorX;
        let coorY;
        for(let j = 0; j<busstopResponse.length;j++){
            if(leavesArray[i].busstopId===busstopResponse[j].id){
                coorX=busstopResponse[j].longitude;
                coorY=busstopResponse[j].latitude;
                break;
            }
        }
        ride[i-1]={id:leavesArray[i].busstopId,dir:directionName,diff:result,longitude:coorX,latitude:coorY, pos: leavesArray[i].pos, line_no:leavesArray[i].linia};
    }
    return ride;
}
function changeArray(busStopArray, array) {
    let rozklad={};
    busStopArray.forEach(busstop=>{
        if(!rozklad[busstop.line_no]) {
            rozklad[busstop.line_no] = {};
        }
            rozklad[busstop.line_no][busstop.direction_name] = [];

    });

    for(let i = 0; i<busStopArray.length;i++){
            let element = array.find((busstop) => {
                return (busStopArray[i].line_no === busstop.line_no && busstop.busstop_no === busStopArray[i].id);
            });
            if (element !== undefined&&element.data!== undefined)
            {
                if(!element.data.direction_name) {
                    element.data.direction_name =busStopArray[i].direction_name;
                    element.data.position = busStopArray[i].position;
                }
                let hours;
                if(element.data.godziny['DZIEŃ POWSZEDNI, ROK SZKOLNY']){
                    hours = element.data.godziny['DZIEŃ POWSZEDNI, ROK SZKOLNY'];
                }
                else if(element.data.godziny['POWSZEDNI LETNI']){
                    hours = element.data.godziny['POWSZEDNI LETNI'];
                }
                else{
                    hours = element.data.godziny;
                }

                element.data.godziny=hours;
                let j = 0;
                for(;j<rozklad[element.line_no][element.data.direction_name].length;j++){
                    if(rozklad[element.line_no][element.data.direction_name][j]===element.data){
                        break;
                    }
                }
                if(rozklad[element.line_no][element.data.direction_name].length===j)
                    rozklad[element.line_no][element.data.direction_name].push(element.data);
            }
        }
    return rozklad;
}
module.exports={
     controller: function(busStopResponse, lineAtBusStopResponse) {
        let line;
        let leavesArray = [];
         let differences=[];
        lineAtBusStopResponse = changeArray(busStopResponse,lineAtBusStopResponse);
        let keys = Object.keys(lineAtBusStopResponse);
        for(let i = 0;i<keys.length;i++) {
            //console.log(lineAtBusStopResponse[keys[i]]);
            let klucze = Object.keys(lineAtBusStopResponse[keys[i]]);
            for (let j = 0; j <klucze.length; j++) {
                leavesArray = findTime(lineAtBusStopResponse[keys[i]][klucze[j]]);
                if (leavesArray) {
                     differences.push(substractTime(leavesArray, busStopResponse));
                }
            }
        }
         line=(Export.prepare(differences));
         Export.download(line);

    }
};
