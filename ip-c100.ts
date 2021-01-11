// Dave

import { VMatrix } from "vapi";
import { FPGASelection } from "vapi/System";
import { pause_ms } from "vscript";
export const readlineSync = require('readline-sync');

// equivalent to dispatch_change_request in vscript.  Don't check the write() method
export const noverify = {
    retry_until:{
        criterion: 'custom',
        validator: () => Promise.resolve(true)
    }
};

// sets the short hostname
async function set_hostname(conn: VMatrix, hostname: string, longHostname?: string) {
    console.log(`Setting hostname to ${hostname}`);
    await conn.system.usrinfo.short_desc.write(hostname);
    if (longHostname) {
        await conn.system.usrinfo.long_desc.write(longHostname);
    } else {
        await conn.system.usrinfo.long_desc.write(hostname);
    }
}

// sets the fpga to mode
async function set_mode(conn: VMatrix, mode: FPGASelection) {
    console.log(`Setting mode for card to ${mode}`);
    await conn.system.select_fpga.command.write(mode);
    await pause_ms(1000);
}

// reboot c100
async function reboot_device(conn: VMatrix) {
    console.log(`Rebooting host`);
    await conn.system.reboot.write("reboot", <any> noverify);
}

// reset c100 - use with caution
async function reset_device(conn: VMatrix) {
    console.log(`Resetting host`);
    await conn.system.reset.write("reset", <any> noverify);
}

// sets a SINGLE IP address on the port specified.
// Gateway is optional but will be set as a default gateway if specified.
async function set_ip(conn: VMatrix, port: number, address: string, prefix: number, gateway?: string) {
    const ports = conn.network_interfaces.ports;

    // first delete all IP addresses on the port.
    var numIP = await (await ports.row(port).desired_configuration.base.ip_addresses.rows()).length;
    console.log(`Number of IP addresses already on interface: ${numIP}`);
    for (const thisIP of await ports.row(port).desired_configuration.base.ip_addresses.rows()) {
        await thisIP.delete_ip_address.write("Click", <any> noverify); 
    }

    // now add a single IP and set it
    await ports.row(port).desired_configuration.base.add_ip_address.write("Click", <any> noverify);
    await pause_ms(500);
    await ports.row(port).desired_configuration.base.ip_addresses.row(0).ip_address.write(address);
    await ports.row(port).desired_configuration.base.ip_addresses.row(0).prefix.write(prefix);

    numIP = await (await ports.row(port).desired_configuration.base.ip_addresses.rows()).length;
    console.log(`Number of IP addresses on interface after config: ${numIP}`);

    // delete all routes on this interface first.
    console.log(`Number of routes on port before route configuration: ${await (await ports.row(port).desired_configuration.base.routes.rows()).length}`);
    for (const route of await ports.row(port).desired_configuration.base.routes.rows()) {
        await route.delete_route.write("Click", <any> noverify);
    }

    if (gateway) {
        // add a route and set it.
        await ports.row(port).desired_configuration.base.add_route.write("Click", <any>noverify);
        await ports.row(port).desired_configuration.base.routes.row(0).via.write(gateway);
    }   

    // wait 500ms then save network config.
    await pause_ms(500);
    await conn.network_interfaces.save_config.write("Click", <any> noverify);
}

// this is used in place of a CSV for testing purposes.
// ultimately this will go away.
function get_gateway_list(): any[] {
    return [
        {
            hostname:       'testgateway',
            vm:             'DMV_40GbE',    // DMV_40GbE / AVP_40GbE
            interfaces: [
                {
                    port:       2,
                    ip:         '172.16.1.4',
                    prefix:     16,
                    //gateway:    '192.168.1.254',
                },
            ]
        },
    ];
}


// main method.
async function main() {
    // this is an example of using readline sync not async to get user input.
    // not needed at this time.
    // Wait for user's response.
    //var intNum = readlineSync.question('What Interface? ');

    // get list of c100s.  This would eventually come from CSV
    const c100_list = get_gateway_list();
    var vmatrix: VMatrix;

    for (const device of c100_list) {
        console.log(`Device hostname: ${device.hostname}`);
        console.log(`Device vm: ${device.vm}`);
        for (const port of device.interfaces) {
            console.log(`Port Number: ${port.port}`);
            console.log(`IP: ${port.ip}`);
            console.log(`Prefix: ${port.prefix}`);
            console.log(`Gateway: ${port.gateway}`);
        }

        // connect to c100.  This would normally be 172.16.1.4 (default front IP).
        vmatrix = await VMatrix.open({
            ip: "10.1.68.96",
            towel: "Reserved - Configuring VM and IP"
        });

        // get the current fpga VM and print it to stdout
        var currentvm = await vmatrix.system.selected_fpga.read();
        console.log(`Current VM: ${currentvm}`);

        // set vm to AVP_40GbE for testing.
        await set_mode(vmatrix, device.vm);

        // set hostname
        await set_hostname(vmatrix, device.hostname);
        
        // set port 2 to default IP for testing.
        await set_ip(vmatrix, device.interfaces[0].port, device.interfaces[0].ip, device.interfaces[0].prefix, device.interfaces[0].gateway);
        
        await pause_ms(2000);
        // reboot device.
        await pause_ms(5000);
        await reset_device(vmatrix);

        // disconnect
        await vmatrix.close();
    }

}

main();
  