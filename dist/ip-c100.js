"use strict";
// Dave
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.noverify = exports.debug = exports.readlineSync = void 0;
var vapi_1 = require("vapi");
var vscript_1 = require("vscript");
var read_devices_1 = require("./read_devices");
exports.readlineSync = require('readline-sync');
// global debugging
exports.debug = true;
// equivalent to dispatch_change_request in vscript.  Don't check the write() method
exports.noverify = {
    retry_until: {
        criterion: 'custom',
        validator: function () { return Promise.resolve(true); }
    }
};
// sets the short hostname
function set_hostname(conn, hostname, longHostname) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Setting hostname to " + hostname);
                    return [4 /*yield*/, conn.system.usrinfo.short_desc.write(hostname)];
                case 1:
                    _a.sent();
                    if (!longHostname) return [3 /*break*/, 3];
                    return [4 /*yield*/, conn.system.usrinfo.long_desc.write(longHostname)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, conn.system.usrinfo.long_desc.write(hostname)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// sets the fpga to mode
function set_mode(conn, mode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Setting mode for card to " + mode);
                    return [4 /*yield*/, conn.system.select_fpga.command.write(mode)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, vscript_1.pause_ms(1000)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// reboot c100
function reboot_device(conn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Rebooting host");
                    return [4 /*yield*/, conn.system.reboot.write("reboot", exports.noverify)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// reset c100 - use with caution
function reset_device(conn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Resetting host");
                    return [4 /*yield*/, conn.system.reset.write("reset", exports.noverify)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// sets a SINGLE IP address on the port specified.
// Gateway is optional but will be set as a default gateway if specified.
function set_ip(conn, port, address, prefix, gateway) {
    return __awaiter(this, void 0, void 0, function () {
        var ports, numIP, _i, _a, thisIP, _b, _c, _d, _e, _f, route;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    ports = conn.network_interfaces.ports;
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.ip_addresses.rows()];
                case 1: return [4 /*yield*/, (_g.sent()).length];
                case 2:
                    numIP = _g.sent();
                    console.log("Number of IP addresses already on interface: " + numIP);
                    _i = 0;
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.ip_addresses.rows()];
                case 3:
                    _a = _g.sent();
                    _g.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    thisIP = _a[_i];
                    return [4 /*yield*/, thisIP.delete_ip_address.write("Click", exports.noverify)];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: 
                // now add a single IP and set it
                return [4 /*yield*/, ports.row(port).desired_configuration.base.add_ip_address.write("Click", exports.noverify)];
                case 8:
                    // now add a single IP and set it
                    _g.sent();
                    return [4 /*yield*/, vscript_1.pause_ms(500)];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.ip_addresses.row(0).ip_address.write(address)];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.ip_addresses.row(0).prefix.write(prefix)];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.ip_addresses.rows()];
                case 12: return [4 /*yield*/, (_g.sent()).length];
                case 13:
                    numIP = _g.sent();
                    console.log("Number of IP addresses on interface after config: " + numIP);
                    // delete all routes on this interface first.
                    _c = (_b = console).log;
                    _d = "Number of routes on port before route configuration: ";
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.routes.rows()];
                case 14: return [4 /*yield*/, (_g.sent()).length];
                case 15:
                    // delete all routes on this interface first.
                    _c.apply(_b, [_d + (_g.sent())]);
                    _e = 0;
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.routes.rows()];
                case 16:
                    _f = _g.sent();
                    _g.label = 17;
                case 17:
                    if (!(_e < _f.length)) return [3 /*break*/, 20];
                    route = _f[_e];
                    return [4 /*yield*/, route.delete_route.write("Click", exports.noverify)];
                case 18:
                    _g.sent();
                    _g.label = 19;
                case 19:
                    _e++;
                    return [3 /*break*/, 17];
                case 20:
                    if (!gateway) return [3 /*break*/, 23];
                    // add a route and set it.
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.add_route.write("Click", exports.noverify)];
                case 21:
                    // add a route and set it.
                    _g.sent();
                    return [4 /*yield*/, ports.row(port).desired_configuration.base.routes.row(0).via.write(gateway)];
                case 22:
                    _g.sent();
                    _g.label = 23;
                case 23: 
                // wait 500ms then save network config.
                return [4 /*yield*/, vscript_1.pause_ms(500)];
                case 24:
                    // wait 500ms then save network config.
                    _g.sent();
                    return [4 /*yield*/, conn.network_interfaces.save_config.write("Click", exports.noverify)];
                case 25:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// this is used in place of a CSV for testing purposes.
// ultimately this will go away.
function get_gateway_list() {
    return read_devices_1.readCSV();
}
// main method.
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var c100_list, vmatrix, _i, c100_list_1, device, _a, _b, port, response, currentvm, _c, _d, thisPort;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    c100_list = get_gateway_list();
                    _i = 0, c100_list_1 = c100_list;
                    _e.label = 1;
                case 1:
                    if (!(_i < c100_list_1.length)) return [3 /*break*/, 15];
                    device = c100_list_1[_i];
                    console.log("Device hostname: " + device.hostname);
                    console.log("Device vm: " + device.vm);
                    for (_a = 0, _b = device.interfaces; _a < _b.length; _a++) {
                        port = _b[_a];
                        console.log("Port Number: " + port.port);
                        console.log("IP: " + port.ip);
                        console.log("Prefix: " + port.prefix);
                        console.log("Gateway: " + port.gateway);
                    }
                    response = exports.readlineSync.question('Press Enter When Connected to Device Front Port, Ctrl-C to cancel.');
                    return [4 /*yield*/, vapi_1.VMatrix.open({
                            ip: "172.16.1.4",
                            towel: "Reserved - Configuring VM and IP"
                        })];
                case 2:
                    // connect to c100.  This would normally be 172.16.1.4 (default front IP).
                    vmatrix = _e.sent();
                    return [4 /*yield*/, vmatrix.system.selected_fpga.read()];
                case 3:
                    currentvm = _e.sent();
                    if (exports.debug)
                        console.log("Current VM: " + currentvm);
                    // set vm to desired vm.
                    if (exports.debug)
                        console.log("Setting Device VM.");
                    return [4 /*yield*/, set_mode(vmatrix, device.vm)];
                case 4:
                    _e.sent();
                    if (!device.hostname) return [3 /*break*/, 6];
                    if (exports.debug)
                        console.log("Setting Hostname.");
                    return [4 /*yield*/, set_hostname(vmatrix, device.hostname)];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6:
                    _c = 0, _d = device.interfaces;
                    _e.label = 7;
                case 7:
                    if (!(_c < _d.length)) return [3 /*break*/, 10];
                    thisPort = _d[_c];
                    // if current VM is *NOT* 40GbE but desired is, interface numbers change.
                    // port 0 is port 0
                    // port 1 is port 4
                    // port 2 is port 8
                    // port 3 is port 9
                    if ((device.vm.match(/40GbE$/i) != null) &&
                        (currentvm.match(/40GbE$/i) == null)) {
                        switch (thisPort.port) {
                            case 1:
                                thisPort.port = 4;
                                if (exports.debug)
                                    console.log("Current VM 10g, desired 40g.  Changing port 1 to port 4.");
                                break;
                            case 2:
                                thisPort.port = 8;
                                if (exports.debug)
                                    console.log("Current VM 10g, desired 40g.  Changing port 2 to port 8.");
                                break;
                            case 3:
                                thisPort.port = 9;
                                if (exports.debug)
                                    console.log("Current VM 10g, desired 40g.  Changing port 3 to port 9.");
                                break;
                        }
                    }
                    return [4 /*yield*/, set_ip(vmatrix, thisPort.port, thisPort.ip, thisPort.prefix, thisPort.gateway)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9:
                    _c++;
                    return [3 /*break*/, 7];
                case 10: 
                // wait for IP setting apply to finish.
                return [4 /*yield*/, vscript_1.pause_ms(2000)];
                case 11:
                    // wait for IP setting apply to finish.
                    _e.sent();
                    // reset device.
                    return [4 /*yield*/, reset_device(vmatrix)];
                case 12:
                    // reset device.
                    _e.sent();
                    // disconnect
                    return [4 /*yield*/, vmatrix.close()];
                case 13:
                    // disconnect
                    _e.sent();
                    _e.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 1];
                case 15: return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=ip-c100.js.map