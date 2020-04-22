import { Parser } from "binary-parser"

// function toUTF8Array(str) {
//     var utf8 = [];
//     for (var i=0; i < str.length; i++) {
//         var charcode = str.charCodeAt(i);
//         if (charcode < 0x80) utf8.push(charcode);
//         else if (charcode < 0x800) {
//             utf8.push(0xc0 | (charcode >> 6),
//                 0x80 | (charcode & 0x3f));
//         }
//         else if (charcode < 0xd800 || charcode >= 0xe000) {
//             utf8.push(0xe0 | (charcode >> 12),
//                 0x80 | ((charcode>>6) & 0x3f),
//                 0x80 | (charcode & 0x3f));
//         }
//         // surrogate pair
//         else {
//             i++;
//             // UTF-16 encodes 0x10000-0x10FFFF by
//             // subtracting 0x10000 and splitting the
//             // 20 bits of 0x0-0xFFFFF into two halves
//             charcode = 0x10000 + (((charcode & 0x3ff)<<10)
//                 | (str.charCodeAt(i) & 0x3ff));
//             utf8.push(0xf0 | (charcode >>18),
//                 0x80 | ((charcode>>12) & 0x3f),
//                 0x80 | ((charcode>>6) & 0x3f),
//                 0x80 | (charcode & 0x3f));
//         }
//     }
//     return utf8;
// }

let in_ep = 1;
let out_ep = 1;

export const dbi = function() {
    // this.airhorn = airhorn;
    // this.decoder = new TextDecoder();
    const CMD_ID_EXIT = 0
    const CMD_ID_LIST = 1
    const CMD_ID_FILE_RANGE = 2

    this.setInEp = function (ep) {
        in_ep = ep
    }

    this.setOutEp = function (ep) {
        out_ep = ep
    }

    // const CMD_TYPE_REQUEST = 0
    const CMD_TYPE_RESPONSE = 1
    // const CMD_TYPE_ACK = 2
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

    this.processExitCommand = function () {
        const buffer = new ArrayBuffer(16);
        let view = new DataView(buffer);
        console.log('DataView')
        view.setUint32(0, 810107460, true);
        view.setUint32(4, CMD_TYPE_RESPONSE, true);
        view.setUint32(8, CMD_ID_EXIT, true);
        view.setUint32(12, 0, true);
        console.log('transferOut');
        this.device.transferOut(1, buffer)
    }

    this.processFileRangeCommand = function (/*dataSize*/) {
    }

    this.processListCommand = function () {

        const testStr = 'Animal Crossing New Horizons [01006F8002326000][v0].nsp\n'

        // console.log('processListCommand');
        const buffer = new ArrayBuffer(16);
        let view = new DataView(buffer);
        view.setUint32(0, 810107460, true);
        view.setUint32(4, CMD_TYPE_RESPONSE, true);
        view.setUint32(8, CMD_ID_LIST, true);
        view.setUint32(12, 56, true);

        // console.log(buffer);

        // console.log('transferOut');
        this.device.transferOut(out_ep, buffer)

        this.device.transferIn(in_ep, 16);
        let enc = new TextEncoder(); // always utf-8

        let ar = enc.encode(testStr)
        // console.log(ar);

        // console.log('transferOut');
        this.device.transferOut(out_ep, ar)
    }

    this._loopRead = async function() {
        if (!this.device) {
            console.log('no device');
            return;
        }

        try {
            console.log('transferIn');
            const result = await this.device.transferIn(in_ep, 16);

            if (result.data && result.data.byteLength === 16) {
                console.log(result.data);
                console.log(result.data.buffer);
                let buf = Buffer.from(result.data.buffer);
                let obj = cmdHeader.parse(buf)
                // {"magic":[68,66,73,48],"cmdType":0,"cmdId":1,"dataSize":0}

                console.log(JSON.stringify(obj));
                if (
                obj.magic[0] === 68 &&
                obj.magic[1] === 66 &&
                obj.magic[2] === 73 &&
                obj.magic[3] === 48) {
                    switch (obj.cmdId) {
                        case CMD_ID_EXIT:
                            this.processExitCommand();
                            break;
                        case CMD_ID_LIST:
                            this.processListCommand();
                            break;
                        case CMD_ID_FILE_RANGE:
                            this.processFileRangeCommand(obj.dataSize);
                            break;
                    }
                }
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
            // let intfNum = 0;
            for (let i in this.device.configurations) {
                let conf = this.device.configurations[i];
                console.table(conf)
                for (let j in conf.interfaces) {
                    let intf = conf.interfaces[j];
                    // intfNum = intf.interfaceNumber
                    for (let k in intf.alternates) {
                        let alt = intf.alternates[k];
                        for (let e in alt.endpoints) {
                            let ep = alt.endpoints[e];
                            if(ep.direction === 'out'){
                                self.setOutEp(ep.endpointNumber);
                            } else {
                                self.setInEp(ep.endpointNumber);
                            }
                        }
                    }
                }
            }
            if (device.configuration === null)
                await device.selectConfiguration(1);
            let millisecondsToWait = 500;
            await setTimeout(function() {
                // Whatever you want to do after the wait
            }, millisecondsToWait);
            await device.claimInterface(0);
            await device.selectAlternateInterface(0, 0);
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