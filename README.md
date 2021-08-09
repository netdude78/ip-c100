# ip-c100
Configure fpga and interfaces on c100s in bulk

Currently in beta.  

User must have a local ethernet interface configured in the 172.16.0.0/24 range (not 172.16.1.4).

Sample device configuration CSV in the dist/ and example/ directory.  Edit the file to set IP addresses,
prefix lengths, default gateways, VM and hostname.  Save the CSV in the same directory as the ip-c100 executable
(included also in the dist directory).  Run the executable.

The program will prompt the user with the IP information about to be applied to the device and allow the user to 
press "Enter" to continue when their laptop is connected to the front port of the C100.  This program will connect
to the DEFAULT IP address of 172.16.1.4 on the front management port.  If the front management port IP address has
been changed, this program will not work without modification.

Once the card IP addresses have been set and it has rebooted, the program will continue and ask the user to move the 
ethernet cable to the next device.

## TODO
* Add warning message indicating card will be reset and wiped

This code is based on the Lawo VMatrix vapi and vscript.  Visit the Docker site to pull the repository here:
https://hub.docker.com/r/arkonatechnologies/vscript

Open Source projects inclued in this project:

https://www.npmjs.com/package/readline-sync (MIT License)
https://www.npmjs.com/package/papaparse (MIT License)
