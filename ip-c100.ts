// Dave

import { VMatrix } from "vapi";
import { FPGASelection } from "vapi/System";
import { pause_ms } from "vscript";
import { WriteOptions } from "vscript/src/vmodel";

export const noverify = {
    retry_until:{
        criterion: 'custom',
        validator: () => Promise.resolve(true)
    }
};

async function set_mode(conn: VMatrix, mode: FPGASelection) {
    console.log(`Setting mode for card to ${mode}`);
    conn.system.select_fpga.command.write(mode);
    await pause_ms(1000);
}

async function reboot(conn: VMatrix) {
    console.log(`Rebooting host`);
    conn.system.reboot.write("reboot", <any> noverify);
}

async function reset(conn: VMatrix) {
    console.log(`Resetting host`);
    conn.system.reset.write("reset", <any> noverify);
}

async function set_ip(conn: VMatrix, port: number, address: string, prefix: number, gateway?: string) {
    const ports = conn.network_interfaces.ports;

    // for (const ip of await ports.row(port).desired_configuration.base.ip_addresses.rows()) {
    //     console.log(`Existing IP Address: ${await ip.ip_address.read()}/${await ip.prefix.read()} on port${port}`);
    //     await ip.delete_ip_address;
        

    // }

    //await ports.row(port).desired_configuration.base.add_ip_address;

    await pause_ms(500);

    if (gateway) {
        ports.row(port).desired_configuration.base.add_route;
    }
    await pause_ms(500);

    ports.row(port).save_config;
}

// async function get_gateway_list() {
//     return {
//         hostname:   'testgateway',
//         vm:         'MULTIVIEWER_40GbE',
//         interfaces: [
//             {
//                 ip:         '192.168.1.1/24',
//                 gateway:    '192.168.1.254'
//             },
//         ]
//     };
// }

async function main() {

    // equivalent to dispatch_change_request
    const noverify = {
        retry_until:{
            criterion: 'custom',
            validator: () => Promise.resolve(true)
        }
    };

    const vmatrix = await VMatrix.open({
      ip: "10.1.68.96",
      towel: "Reserved - Configuring VM and IP"
    });
    //await vmatrix.system.usrinfo.cur_status.write("Hello world");
    // options: AVP_40GbE, MULTIVIEWER_40GbE
    const currentvm = await vmatrix.system.selected_fpga.read();
    console.log(`Current VM: ${currentvm}`);
    //await vmatrix.system.select_fpga.command.update("AVP_40GbE");

    await pause_ms(500);

    //await vmatrix.system.reboot();

    const theports = vmatrix.network_interfaces.ports;

    // for (const ip of await ports.row(port).desired_configuration.base.ip_addresses.rows()) {
    //     console.log(`Existing IP Address: ${await ip.ip_address.read()}/${await ip.prefix.read()} on port${port}`);
    //     await ip.delete_ip_address;
        

    // }
    var numIP = await (await vmatrix.network_interfaces.ports.row(2).desired_configuration.base.ip_addresses.rows()).length;
    console.log(`Number of IP addresses already on interface: ${numIP}`);
    if (numIP > 0) {
        
        for (const thisport of await vmatrix.network_interfaces.ports.row(2).desired_configuration.base.ip_addresses.rows()) {
            await thisport.delete_ip_address.write("Click", <any> noverify); 
            await pause_ms(500);
        }
        await pause_ms(500);
        theports.row(2).save_config.write("Click", <any> noverify);
        await pause_ms(500);
        await vmatrix.network_interfaces.save_config.write("Click", <any> noverify);
    }
    await vmatrix.network_interfaces.ports.row(2).desired_configuration.base.add_ip_address.write("Click", <any> noverify);
    await pause_ms(500);
    await theports.row(2).desired_configuration.base.ip_addresses.row(0).ip_address.write("172.16.1.4");
    await theports.row(2).desired_configuration.base.ip_addresses.row(0).prefix.write(16);
    theports.row(2).save_config.write("Click", <any> noverify);

    numIP = await (await vmatrix.network_interfaces.ports.row(2).desired_configuration.base.ip_addresses.rows()).length;
    console.log(`Number of IP addresses on interface after config: ${numIP}`);

    console.log("Rebooting.");
    await vmatrix.system.reboot.write("reboot", <any> noverify);
    // console.log("System Back UP.");
    // numIP = await (await vmatrix.network_interfaces.ports.row(2).desired_configuration.base.ip_addresses.rows()).length;
    // console.log (`after reboot there are ${numIP} interfaces`);
    // var currentIP = await vmatrix.network_interfaces.ports.row(2).desired_configuration.base.ip_addresses.row(0).ip_address.read();
    // console.log(`IP of int2: ${currentIP}.`)


    await vmatrix.close();
    return;
    const ports = vmatrix.network_interfaces.ports;
    // first delete all IP addresses
    var intcount = 0;
    for (const port of await ports.rows()) {
        for (const ip of await port.desired_configuration.base.ip_addresses.rows()) {
            console.log(`Existing IP Address: ${await ip.ip_address.read()}/${await ip.prefix.read()} on port${intcount}`);
            //ip.delete_ip_address();
        }
        for (const route of await port.desired_configuration.base.routes.rows()) {
            console.log(`Route: ${await route.dst.read()}/${await route.dst_prefix.read()} gw ${await route.via.read()} on port${intcount}`);
        }
        intcount++;
    }
    // ports.row(0).desired_configuration.base.add_ip_address("1.1.1.1/24");
    // ports.row(0).desired_configuration.base.add_route("1.1.1.254");


    console.log("Attempting to add address to port2");
    set_ip(vmatrix, 2, "1.1.1.1", 24);
    console.log("Disconnecting.");
    await vmatrix.close();
  }

var readlineSync = require('readline-sync');
 
// Wait for user's response.
//var intNum = readlineSync.question('What Interface? ');

main();
  