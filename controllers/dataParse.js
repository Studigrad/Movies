const fs = require("fs");
var data = fs.readFileSync(__dirname+"/data.txt");
var testData = {};
var splitList = data.toString().split("\n");
var newData = [];
for (var i = 0; i < splitList.length; i++) {
    const splitted = splitList[i].toString().split(":");
    testData[splitted[0]] = splitted[1];
    //console.log(testData)
    if(splitted[0] ==''){
        newData.push(testData);
        testData={};
    }
}

module.exports = newData;