# ip-c100
Configure fpga and interfaces on c100s in bulk


Currently in development.  Ultimately this script will automatically configure a batch of c100 cards
from a CSV or JSON file.  The user will move their laptop from card to card and this script will connect
to the default IP address of 172.16.1.4 and configure management IP, Media IPs and add routes.  Finally this
script will set the appropriate fpga mode and reset the card, prompting the user to move the cable to the next
device.

Right now the device list is hardcoded.

## TODO
* Add CSV parsing
* Add warning message indicating card will be reset and wiped

This code is based on the Lawo VMatrix vapi and vscript.  Visit the Docker site to pull the repository here:
https://hub.docker.com/r/arkonatechnologies/vscript
