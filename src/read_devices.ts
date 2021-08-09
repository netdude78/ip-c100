import { parse } from 'papaparse';
import { readFileSync } from 'fs';

// define Json datatype
type JsonPrimitive = string | number | boolean | null;
interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> {};
interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> {};
type Json = JsonPrimitive | JsonMap | JsonArray;

export function readCSV(): any[] {
    const file = readFileSync('gw_nodes.csv', 'utf8');
    var final_data: any;
    parse(file, {complete: (result) => 
        {
            final_data = createDeviceList(result.data);
        }
    });

    return final_data;
}

function createDeviceList(data: any): any[] {
    var linecounter = 0;

    let jsonResult: Json = [];
    for (const line of data) {
        // ignore header line
        if (linecounter > 0) {
            if (line[0] != "") {
                let deviceEntry: Json = {};
                deviceEntry["hostname"] = line[0];
                deviceEntry["vm"] = line[1];
                deviceEntry["interfaces"] = [];                
                
                // if there is a front_ip:
                if (line[2] != "") {
                    let frontInt: Json = {};
                    frontInt["port"] = 2;
                    frontInt["ip"] = line[2];
                    frontInt["prefix"] = parseInt(line[3]);
                    if(line[4] != "") {
                        frontInt["gateway"] = line[4];
                    }
                    deviceEntry["interfaces"].push(frontInt);
                }

                // if there is a back_ip:
                if (line[5] != "") {
                    let backInt: Json = {};
                    backInt["port"] = 3;
                    backInt["ip"] = line[5];
                    backInt["prefix"] = parseInt(line[6]);
                    if(line[7] != "") {
                        backInt["gateway"] = line[7];
                    }
                    deviceEntry["interfaces"].push(backInt);
                }

                // if there is a left_ip:
                if (line[8] != "") {
                    let leftInt: Json = {};
                    leftInt["port"] = 0;
                    leftInt["ip"] = line[8];
                    leftInt["prefix"] = parseInt(line[9]);
                    if(line[10] != "") {
                        leftInt["gateway"] = line[10];
                    }
                    deviceEntry["interfaces"].push(leftInt);
                }

                // if there is a right_ip:
                if (line[11] != "") {
                    let rightInt: Json = {};
                    rightInt["port"] = 1;
                    rightInt["ip"] = line[11];
                    rightInt["prefix"] = parseInt(line[12]);
                    if(line[13] != "") {
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