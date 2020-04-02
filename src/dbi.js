export const dbi = {

    connect: () => {
        return new Promise((resolve, reject) => {
            if (navigator.usb) {
                navigator.usb
                    .requestDevice({
                        filters: [{vendorId: 0x057E, productId: 0x3000}]
                    }).then(usbDevice => {
                    return resolve("connected" + usbDevice.productName)
                }).catch(() => {
                    return reject()
                });
            } else {
                return reject()
            }
        })
    }
}