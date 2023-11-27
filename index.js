const express = require('express'),
    app = express(),
    { proxy, scriptUrl } = require('rtsp-relay')(app),
    os = require('os'),
    interfaces = os.networkInterfaces(),
    args = process.argv.slice(2),
    getPort = parseInt(args[0]);
var PORT = 2000;
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
if (getPort != null&&Number.isInteger(getPort)) { 
    PORT = getPort;
}
app.listen(PORT, () => {
    console.log('IPv4 address on the machine:');
    for (const key in interfaces) {
        for (const iface of interfaces[key]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`${iface.address}:${PORT}`);
            }
        }
    }
});
