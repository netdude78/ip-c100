"use strict";
exports.__esModule = true;
exports.readCSV = void 0;
var papaparse_1 = require("papaparse");
var fs_1 = require("fs");
;
;
function readCSV() {
    var file = fs_1.readFileSync('gw_nodes.csv', 'utf8');
    var final_data;
    papaparse_1.parse(file, { complete: function (result) {
            final_data = createDeviceList(result.data);
        }
    });
    return final_data;
}
exports.readCSV = readCSV;
function createDeviceList(data) {
    var linecounter = 0;
    var jsonResult = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var line = data_1[_i];
        // ignore header line
        if (linecounter > 0) {
            if (line[0] != "") {
                var deviceEntry = {};
                deviceEntry["hostname"] = line[0];
                deviceEntry["vm"] = line[1];
                deviceEntry["interfaces"] = [];
                // if there is a front_ip:
                if (line[2] != "") {
                    var frontInt = {};
                    frontInt["port"] = 2;
                    frontInt["ip"] = line[2];
                    frontInt["prefix"] = parseInt(line[3]);
                    if (line[4] != "") {
                        frontInt["gateway"] = line[4];
                    }
                    deviceEntry["interfaces"].push(frontInt);
                }
                // if there is a back_ip:
                if (line[5] != "") {
                    var backInt = {};
                    backInt["port"] = 3;
                    backInt["ip"] = line[5];
                    backInt["prefix"] = parseInt(line[6]);
                    if (line[7] != "") {
                        backInt["gateway"] = line[7];
                    }
                    deviceEntry["interfaces"].push(backInt);
                }
                // if there is a left_ip:
                if (line[8] != "") {
                    var leftInt = {};
                    leftInt["port"] = 0;
                    leftInt["ip"] = line[8];
                    leftInt["prefix"] = parseInt(line[9]);
                    if (line[10] != "") {
                        leftInt["gateway"] = line[10];
                    }
                    deviceEntry["interfaces"].push(leftInt);
                }
                // if there is a right_ip:
                if (line[11] != "") {
                    var rightInt = {};
                    rightInt["port"] = 1;
                    rightInt["ip"] = line[11];
                    rightInt["prefix"] = parseInt(line[12]);
                    if (line[13] != "") {
                        rightInt["gateway"] = line[13];
                    }
                    deviceEntry["interfaces"].push(rightInt);
                }
                jsonResult.push(deviceEntry);
            }
        }
        linecounter++;
    }
    return jsonResult;
}
//# sourceMappingURL=read_devices.js.map