const express = require('express'),
    app = express(),
    { proxy, scriptUrl } = require('rtsp-relay')(app),
    os = require('os'),
    interfaces = os.networkInterfaces();
addresses = [],
    PORT = 2000;
app.ws('/:cameraIP', (ws, req) => {
    console.log(`request from ${req.headers.origin}`);
    var cameraIP = decodeURIComponent(req.params.cameraIP);
    console.log(`cameraIP: ${cameraIP}`);
    proxy({
        url: `rtsp://${config_data.cctv_rtsp.rtsp_url}`,
        transport: 'tcp',
        verbose: true,
    })(ws);
});
app.listen(2000, () => {
    console.log('IPv4 address on the machine:');
    for (const key in interfaces) {
        for (const iface of interfaces[key]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
                console.log(`${iface.address}:${PORT}`);
            }
        }
    }
});
