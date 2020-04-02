import { Parser } from "binary-parser"

export const dbi = function() {
    // this.airhorn = airhorn;
    // this.decoder = new TextDecoder();

    const cmdHeader = new Parser()
        .endianess("little")
        .array("magic", {
            type: "uint8",
            length: 4
        })
        .uint32("cmdType")
        .uint32("cmdId")
        .uint32("dataSize")

    this.connected = false;
    const self = this;
    this._loopRead = async function() {
        if (!this.device) {
            console.log('no device');
            return;
        }

        try {
            const result = await this.device.transferIn(1, 16);


            if (result.data && result.data.byteLength === 16) {
                console.log(result.data)
                console.log(result.data.buffer)
                let buffer = Buffer.from(result.data.buffer);
                console.log(JSON.stringify(cmdHeader.parse(buffer)));
            }

            self._loopRead();
        } catch (e) {
            console.log('Error reading data', e);
        }
    };

    this.connect = async function() {
        try {
            const device = await navigator.usb.requestDevice({
                filters: [{'vendorId': 0x057E, 'productId': 0x3000}]
            });
            this.device = device;
            await device.open();
            await device.selectConfiguration(1);
            await device.claimInterface(0);
            self._loopRead();
        } catch (e) {
            console.log('Failed to Connect: ', e);
        }
    };

    this.disconnect = async function() {
        if (!this.device) {
            return;
        }

        // await this.device.controlTransferOut({
        //     'requestType': 'class',
        //     'recipient': 'interface',
        //     'request': 0x22,
        //     'value': 0x00,
        //     'index': 0x00,
        // });
        await this.device.close();
        this.device = null;
    };
};