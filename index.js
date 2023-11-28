const express = require('express'),
    app = express(),
    { proxy, scriptUrl } = require('rtsp-relay')(app),
    args = process.argv.slice(2),
    getPort = parseInt(args[0]);
var PORT = 2000;
app.ws('/:cameraIP', (ws, req) => {
    console.log(`request from ${req.headers.origin}`);
    var cameraIP = decodeURIComponent(req.params.cameraIP);
    console.log(`cameraIP: ${cameraIP}`);
    proxy({
        url: `rtsp://${cameraIP}`,
        transport: 'tcp',
        verbose: true,
    })(ws);
});
if (getPort != null&&Number.isInteger(getPort)) { 
    PORT = getPort;
}
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
