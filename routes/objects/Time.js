let Export= require('./ExportToCSV');
function findTime(stopsArray) {
    if (stopsArray[0]) {
        let leavesArray = [];
        console.log(stopsArray[0].direction_name);
        let keys = Object.keys(stopsArray[0].godziny);
        let i = loops(keys, stopsArray);
        for (let j = 0; j < stopsArray.length; j++) {
            keys = Object.keys(stopsArray[j].godziny);
            leavesArray.push(findingLoops(stopsArray[j], keys, i));
        }
        //console.log(leavesArray);
        return leavesArray;
    }
}
function findingLoops(stopsArray, keys, i) {
    let z = 0;
    console.log(stopsArray.godziny);
    for(let x = 0;x<keys.length;x++){
        let minutes = stopsArray.godziny[keys[x]];
        for(let w = 0; w<minutes.length;w++){
            if(i===z){
                console.log(keys[x],minutes[w]);
                console.log(minutes);
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
    //ride[0] = [lineNumber,direction];
    //console.log(leavesArray);
    //console.log(busstopResponse);
    for(let i = 1; i<leavesArray.length; i++){
        ride[i-1]={};
                let result = leavesArray[i].leaveTime - leavesArray[i - 1].leaveTime;
                if (result < 0)
                    result += 60;
                //console.log(result);
                /*console.log(leavesArray[i][leavesArray[i].length-1].line);
                console.log(leavesArray[i][leavesArray[i].length-1].dir);*/
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
    busStopArray.forEach(
        (busstopOnLine) => {
            let element = array.find((busstop) => {
                return (busstopOnLine.line_no === busstop.line_no && busstop.busstop_no === busstopOnLine.id);
            });
            if (element !== undefined&&element.data!== undefined)
            {
                element.data.direction_name=busstopOnLine.direction_name;
                element.data.position=busstopOnLine.position;
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
                rozklad[element.line_no][element.data.direction_name].push(element.data);
            }
        }
    );
    return rozklad;
}
module.exports={
     controller: function(busStopResponse, lineAtBusStopResponse) {
        let line=[];
        let leavesArray = [];
         let differences=[];
        lineAtBusStopResponse = changeArray(busStopResponse,lineAtBusStopResponse);
        let keys = Object.keys(lineAtBusStopResponse);
        for(let i = 0;i<keys.length;i++) {
            let klucze = Object.keys(lineAtBusStopResponse[keys[i]]);
            for (let j = 0; j <klucze.length; j++) {
                leavesArray = findTime(lineAtBusStopResponse[keys[i]][klucze[j]]);
                /*console.log(leavesArray.length);
                console.log(leavesArray[0].dir);
                console.log(leavesArray[0].linia);*/

                if (leavesArray) {
                     differences.push(substractTime(leavesArray, busStopResponse));
                }
            }

        }
         line=(Export.prepare(differences));
        //console.log(line);
        /*for(let i = 0; i<line.length;i++)
            console.log(line[i]);*/
         Export.download(line);

    }
};
/*let stopsArray=[/*'felin spiessa','rondo przemyslowcow','rondo karszo-siedlewskiego','vetterow','felin europark','doswiadczalna'];
let timesArray={'felin spiessa':{'5':['55'],'6':['35'],'7':['15','55'],'13':['55'],
    '14':['35'],'15':['15','55'],'16':['35'],'19':['15'],'22':['20']},
    'rondo przemyslowcow':{'5':['57'],'6':['37'],'7':['17','57'],'13':['57'],
    '14':['37'],'15':['17','57'],'16':['37'], '19':['17'],'22':['22']},
    'rondo karszo-siedlewskiego':{'5':['58'], '6':['38'],'7':['18','58'],'13':['58'],
    '14':['38'],'15':['18','58'],'16':['38'],'19':['18'],'22':['23']},
    'vetterow':{'5':['59'],'6':['39'],'7':['19','59'],'13':['59'],'14':['39'],
    '15':['19','59'],'16':['39'],'19':['19'],'22':['24']},
    'felin europark':{'6':['00','40'],'7':['20'],'8':['00'],'14':['00','40'],
    '15':['20'],'16':['00','40'],'19':['20'],'22':['25']},
    'doswiadczalna':{'6':['02','42'],'7':['22'],'8':['02'],'14':['02','42'],
    '15':['22'],'16':['02','42'],'19':['22'],'22':['27']}};*/
